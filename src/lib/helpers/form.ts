import { ReactNode } from "react";
import { FieldPath, FieldValues } from "react-hook-form";
import { RequiredFieldPath } from "../types/Form";

function isRequiredField<T extends FieldValues>(fieldPath: string, requiredFields?: RequiredFieldPath<T>[]): boolean {
  if (!requiredFields) {
    return false;
  }

  return requiredFields.some((reqPath) => {
    // append wildcard at the end if required field might be an array (e.g., "object.array into object.array.*")
    const regexPath = reqPath.replaceAll(/\.\d+/g, String.raw`\.\d+`).replaceAll(/\*+/g, String.raw`\d+`);
    const finalRegex = new RegExp(`^${regexPath}(\\.\\d+)?$`);
    return finalRegex.test(fieldPath);
  });
}

const getRequiredLabel = <T extends FieldValues>(
  label: ReactNode,
  fieldPath: FieldPath<T>,
  requiredFields?: RequiredFieldPath<T>[],
): ReactNode => (typeof label === "string" ? (isRequiredField(fieldPath, requiredFields) ? `${String(label)} *` : label) : label);

export { getRequiredLabel, isRequiredField };
