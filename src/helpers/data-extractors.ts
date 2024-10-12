export const extractPatternDetails = (
  codename: string
): {
  width: number | null;
  height: number | null;
  patternType: string | null;
} => {
  // Витягуємо ширину та висоту
  const widthHeightMatch = codename.match(/\((\d+)x(\d+)\)/);
  const width = widthHeightMatch ? parseInt(widthHeightMatch[1]) : null;
  const height = widthHeightMatch ? parseInt(widthHeightMatch[2]) : null;

  // Витягуємо другу літеру після дефіса
  const patternTypeMatch = codename.match(/-(\w)(\w)/);

  const patternType = patternTypeMatch
    ? patternTypeMatch[2] === 'B'
      ? 'blends'
      : patternTypeMatch[2] === 'S'
        ? 'solids'
        : null
    : null;

  return { width, height, patternType };
};
