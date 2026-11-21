import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const prTitle = process.env.PR_TITLE || "";
const prBody = process.env.PR_BODY || "";
const workspacePackagesChanged = process.env.WORKSPACE_PACKAGES_CHANGED === "true";

// The script lives in scripts/, so the repository root is one level up.
const repoRoot = path.resolve(import.meta.dirname, "..");

/**
 * Read the fixed package groups from .changeset/config.json
 */
function getFixedPackages() {
  const configPath = path.join(repoRoot, ".changeset", "config.json");
  const raw = fs.readFileSync(configPath, "utf8").replace(/^\uFEFF/, "");
  const config = JSON.parse(raw);
  // fixed is an array of arrays, so flatten all groups
  return (config.fixed || []).flat();
}

/**
 * Parse dependency updates from the Dependabot PR body.
 *
 * Dependabot uses a few slightly different phrasings depending on the PR type:
 *   - Single / security PRs:  "Bumps [name](url) from X to Y"
 *   - Grouped PRs:            "Updates `name` from X to Y" (name in backticks,
 *                             sometimes as a markdown link instead)
 *
 * We accept "Bumps", "Update", "Updates" and "Updated", and match the dependency
 * name written either as a markdown link `[name](url)` or in `backticks`. If the
 * body can't be parsed the caller falls back to the PR title, so this never fails.
 */
function parseDependencyUpdates(body) {
  const regex = /(?:Bumps|Updates?|Updated)\s+(?:\[([^\]]+)\]\([^)]+\)|`([^`]+)`)\s+from\s+(\S+)\s+to\s+(\S+)/g;
  const updates = [];
  let match;
  while ((match = regex.exec(body)) !== null) {
    updates.push({
      name: match[1] || match[2],
      from: match[3].replace(/[.,;:]+$/, ""),
      to: match[4].replace(/[.,;:]+$/, ""),
    });
  }
  return updates;
}

/**
 * Compare two version strings and return the bump type.
 * Handles versions with or without 'v' prefix.
 * Falls back to "patch" if versions can't be parsed.
 */
function getBumpType(from, to) {
  const parse = (v) =>
    v
      .replace(/^v/, "")
      .split(".")
      .map((n) => parseInt(n, 10));
  const fromParts = parse(from);
  const toParts = parse(to);

  if (fromParts.some(isNaN) || toParts.some(isNaN)) {
    return "patch";
  }

  if ((toParts[0] || 0) !== (fromParts[0] || 0)) return "major";
  if ((toParts[1] || 0) !== (fromParts[1] || 0)) return "minor";
  return "patch";
}

/**
 * Get the emoji indicator for a bump type.
 */
function bumpEmoji(bumpType) {
  switch (bumpType) {
    case "major":
      return "🔴 major";
    case "minor":
      return "🟡 minor";
    default:
      return "🟢 patch";
  }
}

/**
 * Build the changeset file content.
 */
function buildChangeset(fixedPackages, updates) {
  const lines = [];

  // Frontmatter
  lines.push("---");
  if (workspacePackagesChanged) {
    for (const pkg of fixedPackages) {
      lines.push(`"${pkg}": patch`);
    }
  }
  lines.push("---");
  lines.push("");

  // Title
  lines.push(prTitle);

  // Dependency table (if we parsed any updates)
  if (updates.length > 0) {
    lines.push("");
    lines.push("| Package | From | To | Bump |");
    lines.push("|---------|------|----|------|");
    for (const dep of updates) {
      const bump = getBumpType(dep.from, dep.to);
      lines.push(`| ${dep.name} | ${dep.from} | ${dep.to} | ${bumpEmoji(bump)} |`);
    }
  }

  lines.push("");
  return lines.join("\n");
}

// Main
const fixedPackages = getFixedPackages();

// This script assumes packages are managed as a single "fixed" group (see
// .changeset/config.json). If a dependency update touched a workspace package but
// no fixed group is configured, we'd emit an empty changeset: CI would pass but
// nothing would ever be released. Fail loudly instead so the omission is obvious.
if (workspacePackagesChanged && fixedPackages.length === 0) {
  console.error(
    "A workspace package changed but no 'fixed' group is configured in .changeset/config.json.\n" +
      "This script bumps the fixed group. Without one it cannot know which packages to bump.\n" +
      "Add a 'fixed' group, or adapt this script to bump the specific changed packages.",
  );
  process.exit(1);
}

const updates = parseDependencyUpdates(prBody);
const content = buildChangeset(fixedPackages, updates);

const id = crypto.randomBytes(8).toString("hex");
const filename = `dependabot-${id}.md`;
const changesetDir = path.join(repoRoot, ".changeset");
const filepath = path.join(changesetDir, filename);

fs.writeFileSync(filepath, content, "utf8");
console.log(`Created changeset: .changeset/${filename}`);
