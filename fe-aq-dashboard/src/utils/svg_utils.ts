export function wrapSvgText(text: string, maxChars = 20) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  words.forEach((word) => {
    if ((current + word).length > maxChars) {
      lines.push(current.trim());
      current = "";
    }
    current += word + " ";
  });

  if (current.trim()) lines.push(current.trim());
  return lines;
}
