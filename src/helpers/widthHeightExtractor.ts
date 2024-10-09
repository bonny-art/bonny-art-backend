export const extractWidthHeight = (
  codename: string
): { width: number | null; height: number | null } => {
  const widthHeightMatch = codename.match(/\((\d+)x(\d+)\)/);
  const width = widthHeightMatch ? parseInt(widthHeightMatch[1]) : null;
  const height = widthHeightMatch ? parseInt(widthHeightMatch[2]) : null;
  return { width, height };
};
