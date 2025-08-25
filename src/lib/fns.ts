export function getKeyByValue(obj: Record<string, string>, value: string) {
  const lowercasedValue = value?.toLowerCase();
  const lowercasedObj = Object?.fromEntries(
    Object?.entries(obj)?.map(([key, val]) => [
      key,
      String(val)?.toLowerCase(),
    ]),
  );
  const foundKey = Object?.keys(obj)?.find(
    (key) => lowercasedObj[key] === lowercasedValue,
  );
  return foundKey ? foundKey.toLowerCase() : undefined;
}
