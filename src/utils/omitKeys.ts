export const omitKeys = <T extends Record<string, any>>(
  obj: T,
  keys: (keyof T)[],
): Partial<T> => {
  const result = { ...obj };
  keys.forEach((k) => {
    delete result[k];
  });
  return result;
};
