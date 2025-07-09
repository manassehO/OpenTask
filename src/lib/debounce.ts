export function debounce(
  func: (value: string) => void,
  delay: number,
): (value: string) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (value: string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(value);
    }, delay);
  };
}
