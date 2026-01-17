// Type-safe field equality checker
const isPrimitive = (value: unknown): value is string | number | boolean | null =>
  value === null || ["string", "number", "boolean"].includes(typeof value);

const isDeepEqual = (a: unknown, b: unknown): boolean => {
  // Handle null/undefined
  if (a === null || b === null) return a === b;
  if (a === undefined || b === undefined) return a === b;

  // Primitive comparison
  if (isPrimitive(a) && isPrimitive(b)) return a === b;

  // Array comparison
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => isDeepEqual(item, b[index]));
  }

  // Object comparison
  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    return keysA.every(key =>
      key in (b as Record<string, unknown>) && isDeepEqual(a[key as keyof typeof a], b[key as keyof typeof b])
    );
  }

  return false;
};
// ✅ 100% FIXED - Just change this ONE line
export const getEqualFields = <
  T extends Record<string, unknown>
>(
  existing: T,
  incoming: Partial<T>  // ✅ Single type parameter
): {
  equalFields: (keyof Partial<T>)[];
  changedFields: (keyof Partial<T>)[];
} => {
  const equalFields: (keyof Partial<T>)[] = [];
  const changedFields: (keyof Partial<T>)[] = [];

  // ✅ SAFEST approach - Object.entries
  Object.entries(incoming).forEach(([key, incomingValue]) => {
    const typedKey = key as keyof T;  // ✅ Type safe!
    const existingValue = existing[typedKey];  // ✅ NO ERROR!
    
    const isSame = isDeepEqual(existingValue, incomingValue);

    if (isSame) {
      equalFields.push(typedKey);
    } else {
      changedFields.push(typedKey);
    }
  });

  return { equalFields, changedFields };
};
