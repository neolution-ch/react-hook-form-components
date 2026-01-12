import { ReactNode } from "react";
import { FieldPath, FieldValues } from "react-hook-form";
import { RequiredFieldPath } from "../types/Form";
import { isNullOrWhitespace } from "@neolution-ch/javascript-utils";

const matchesWildcard = (rule: string, pathParts: string[]) => {
  const ruleParts = rule.split(".");
  // remove trailing index placeholder in case of primitive arrays
  if (pathParts.length - ruleParts.length === 1 && pathParts.at(-1) === "*") {
    pathParts = pathParts.slice(0, -1);
  }
  return ruleParts.length === pathParts.length && pathParts.every((p, i) => ruleParts[i] === p);
};

const isRequiredField = <T extends FieldValues>(fieldPath: string, requiredFields?: RequiredFieldPath<T>[]) => {
  const normalizedPathParts = fieldPath.split(".").map((x) => (Number.isNaN(Number(x)) ? x : "*"));
  return !!requiredFields?.some((rule) => rule === fieldPath || matchesWildcard(rule, normalizedPathParts));
};

const getRequiredLabel = <T extends FieldValues>(
  label: ReactNode,
  fieldPath: FieldPath<T>,
  requiredFields?: RequiredFieldPath<T>[],
): ReactNode =>
  typeof label === "string" && !isNullOrWhitespace(label) && isRequiredField(fieldPath, requiredFields) ? `${String(label)} *` : label;

export { getRequiredLabel, isRequiredField };
