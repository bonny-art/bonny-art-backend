export const sanitizeName = (
  name: string,
  allowSpaces: boolean = true
): string => {
  const trimmedName = name.trim();
  const sanitizedName = allowSpaces
    ? trimmedName.replace(/\s+/g, ' ')
    : trimmedName.replace(/\s+/g, '');

  return sanitizedName;
};
