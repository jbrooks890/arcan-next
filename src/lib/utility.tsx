export const makeHTMLSafe = (str: string): string => {
  let result = str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z,A-Z,0-9,$,_]/g, "-");
  return result;
};

export const getFormattedDate = (dateString: string): string => {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(
    new Date(dateString)
  );
};
