import useFormInputs from "@/hooks/useFormInputs";
import styles from "@/styles/form/Table.module.scss";
import { CSSProperties, ReactElement } from "react";

type TablePropsType = {
  data: object[];
  primary?: string;
  headers: string[];
  omitted?: string[];
  ancestors?: string[];
  children: ReactElement | ReactElement[];
};

export default function Table({
  data,
  headers,
  primary = headers[0],
  omitted,
  ancestors = [],
  id,
  className,
  children,
}: TablePropsType & Passthrough) {
  const { labelize } = useFormInputs();
  const isArray = Array.isArray(data);
  let colCount = headers.length;
  if (isArray) colCount += 1;

  // headers.splice(headers.indexOf(primary), 1);
  // headers = [primary, ...headers.sort()];

  // data = data.sort((a, b) => {
  //   return a[primary] > b[primary] ? 1 : -1;
  // });

  const style: CSSProperties = {
    gridTemplateColumns: `20ch repeat(${headers.length - 1},20%)`,
  };

  return (
    <div className={`${styles.wrap} flex col`}>
      <div
        id={id}
        className={`${styles.table} ${isArray ? "array" : "object"} grid ${
          className ?? "exo"
        }`}
        style={style}
      >
        {headers.map((header, i) => {
          if (header.includes(".")) header = header.split(".").pop()!;
          return (
            <div
              key={i}
              className={`${styles.header} ${
                header === primary ? styles.primary : "non-primary"
              }`}
            >
              {labelize(header)}
            </div>
          );
        })}
        {data.map(record => {
          return headers.map(field => {
            // console.log({ field, record });
            const value = record[field];

            return (
              <div
                key={field}
                className={`${
                  field === primary ? styles.primary : styles.data
                } flex middle`}
                data-col={field}
              >
                {typeof value === "object" ? `[${field}]` : String(value)}
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}
