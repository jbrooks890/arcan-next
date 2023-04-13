import { ReactElement } from "react";
import Table from "@/components/form/Table";
import TableEntry from "@/components/form/TableEntry";

type tableType = (
  data: object,
  options: {
    omittedFields: string[];
    headers: string[];
    ancestors: string[];
    contents?: Function;
  }
) => ReactElement;

export default function useTableElement() {
  const table: tableType = (data, options) => {
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
  return { table };
}
