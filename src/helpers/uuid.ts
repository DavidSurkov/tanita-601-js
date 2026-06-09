export function generateRandomUUID(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const fallbackInCaseOfSymbol = (
  value: symbol | string | number,
): string | number => {
  if (typeof value === "symbol") return generateRandomUUID();
  return value;
};
