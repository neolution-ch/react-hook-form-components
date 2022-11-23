import { FieldValues } from "react-hook-form";

interface UseSafeNameIdResult {
  name: string;
  id: string;
}

const useSafeNameId = <T extends FieldValues>(name: keyof T, id?: string): UseSafeNameIdResult => {
  const safeName = String(name);
  const safeId = id || safeName;

  return {
    name: safeName,
    id: safeId,
  };
};

export { useSafeNameId };
