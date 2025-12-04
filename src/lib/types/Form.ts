import { FieldPath, FieldValues } from "react-hook-form";

type FieldPathArray<T> =
  T extends Array<infer U>
    ? `*.${FieldPathArray<U>}`
    : T extends object
      ? {
          [K in keyof T & (string | number)]: `${K}` | `${K}.${FieldPathArray<T[K]>}`;
        }[keyof T & (string | number)]
      : never;

type RequiredFieldPath<T extends FieldValues> = FieldPath<T> | FieldPathArray<T>;

export { RequiredFieldPath };
