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

export const extractDisplayTxt = (str: string) => {};

export const prune = <Data,>(
  data: Data,
  // omit?: { [Field in keyof Data]: Field },
  omit?: keyof Data[],
  sort = false
) => {
  const arr = Object.entries(data);

  let pruned = omit
    ? arr
        .filter(([field]) => !omit.includes(field))
        .map(([field, value]) =>
          typeof value === "object"
            ? [field, prune(value, omit, sort)]
            : [field, value]
        )
    : arr;

  if (sort) pruned = pruned.sort();

  return Object.fromEntries(pruned);
};
