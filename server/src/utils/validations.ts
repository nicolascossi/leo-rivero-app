export const cleanUndefinedValues = (
  object: Record<string, unknown>
): Record<string, unknown> =>
  Object.fromEntries(Object.entries(object).filter(([_, value]) => value !== undefined));
