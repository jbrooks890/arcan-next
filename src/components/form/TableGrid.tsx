import styles from "@/styles/form/TableGrid.module.scss";
import { ReactElement } from "react";

type Props<T> = {
  data: T;
  headers: string[]; // TODO
  children: ReactElement | ReactElement[];
};

export default function ({ data, headers, children }: Props<typeof data>) {
  // const columns = headers.length;
  return <div className={`${styles.table} grid`}>{children}</div>;
}
