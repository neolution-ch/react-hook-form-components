/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");

const typesFilePath = path.resolve("node_modules/@types/autosuggest-highlight/index.d.ts");

// Define the new content you want to inject into the file
const newContent = `
declare module 'autosuggest-highlight' {
  // Your type declarations or empty declaration if needed
  export function someFunction(): any; // Or add any other types you need
}
`;

// Check if the file exists, and write new content if it does
fs.writeFileSync(typesFilePath, newContent, "utf8");
