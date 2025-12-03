import { ReactNode } from "react";
import { FieldPath, FieldValues } from "react-hook-form";

function isRequiredField<T extends FieldValues>(fieldPath: FieldPath<T>, requiredFields?: FieldPath<T>[]): boolean {
  if (!requiredFields) {
    return false;
  }

  return requiredFields.some((reqPath) => {
    // Convert numeric indices to wildcard
    const regexPath = reqPath.replaceAll(/\.\d+/g, String.raw`\.\d+`);
    const regex = new RegExp(`^${regexPath}$`);
    return regex.test(fieldPath);
  });
}

const getRequiredLabel = <T extends FieldValues>(label: ReactNode, fieldPath: FieldPath<T>, requiredFields?: FieldPath<T>[]): ReactNode =>
  typeof label === "string" ? (isRequiredField(fieldPath, requiredFields) ? `${String(label)} *` : label) : label;

export { getRequiredLabel };
