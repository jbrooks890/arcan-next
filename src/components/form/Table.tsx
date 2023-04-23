import styles from "@/styles/form/Table.module.scss";
import { useDBMaster } from "../contexts/DBContext";
import TableEntry from "./TableEntry";
import Checkbox from "./Checkbox";
import { ReactElement } from "react";

type PropsType = {
  // data: object;
  headers: string[];
  id?: string;
  className?: string;
  omitted?: string[];
  isArray: boolean;
  ancestors?: string[];
  // selections: string[]
  children: ReactElement | ReactElement[];
};

export default function Table({
  // data = {},
  id,
  className,
  omitted = [],
  headers,
  // headers = Object.keys(Object.values(data)[0]).filter(
  //   entry => !omitted.includes(entry)
  // ),
  isArray,
  ancestors = [],
  children,
}: PropsType) {
  return (
    <table
      id={id}
      className={`${styles.table} ${isArray ? "array" : "object"} ${
        className ?? "exo"
      }`}
    >
      <thead>
        <tr>
          <th className="corner">
            <input type="checkbox" />
          </th>
          {headers.map((col, i) => (
            <th key={i} className={styles.header}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
