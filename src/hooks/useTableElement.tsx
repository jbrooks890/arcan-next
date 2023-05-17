import { ReactElement } from "react";
import Table from "@/components/form/Table";
import TableEntry from "@/components/form/TableEntry";

type TableAPIType<Data> = (
  data: Data,
  options: {
    omittedFields: string[];
    headers: keyof Data;
    ancestors: string[];
    contents?: Function;
  }
) => ReactElement<HTMLTableElement>;

export default function useTableElement() {
  // --------------\ UNPACK OBJECT /--------------

  const unpackObj = (obj: object): any[] =>
    Object.entries(obj).flatMap(entry => {
      const [key, value] = entry;
      if (typeof value === "object" && !Array.isArray(value)) {
        const child = unpackObj(value).map(([child, _value]) => [
          `${key}.${child}`,
          _value,
        ]);
        return child;
      }
      return [entry];
    });

  // --------------\ CREATE HEADERS /--------------
  const createHeaders = (
    data: object,
    primary?: string,
    omit?: string[],
    sort = false
  ) => {
    const isArray = Array.isArray(data);
    let arr = isArray ? data : Object.values(data);
    // if (!primary) primary = arr[0];
    let colCount = arr.length;
    if (isArray) colCount += 1;

    // -----------: SORT :-----------
    if (sort) arr = arr.sort((a, b) => (a[primary] > b[primary] ? 1 : -1));

    let result = Array.from(
      new Set(
        arr.reduce((prev, curr) => {
          return [...prev, ...Object.keys(curr).sort()];
        }, [])
      )
    );

    // -----------: OMIT :-----------
    if (omit?.length) result = result.filter(field => !omit.includes(field));

    // ---------: PRIMARY :---------
    if (primary && result.includes(primary)) {
      result.splice(result.indexOf(primary), 1);
      result = [primary, ...result];
    }

    return result;
  };

  const table: TableAPIType = (data, options) => {
    const {
      omittedFields = [],
      headers = Object.keys(Object.values(data)[0]).filter(
        entry => !omittedFields.includes(entry)
      ),
      ancestors = [],
      contents,
      ...props
    } = options;
    const isArray = Array.isArray(data);

    return (
      <Table {...{ headers, isArray, ...props }}>
        {Object.entries(data).map(([index, entry], i) => (
          <TableEntry
            {...{ index, entry, headers }}
            key={i}
            ancestors={[...ancestors, i]}
          >
            {contents?.(entry)}
          </TableEntry>
        ))}
      </Table>
    );
  };
  return {
    table,
    createHeaders,
    // unpackObj,
    unpackObj: (obj: object) => Object.fromEntries(unpackObj(obj)),
  };
}
