import styles from "@/styles/form/Accordion.module.scss";
import { ReactNode, useRef, useState } from "react";

type Props = { field: string; list: ReactNode; sum?: string; mode?: boolean };

export default function Accordion({ field, list, sum, mode = false }: Props) {
  const [open, setOpen] = useState(mode);
  const listEm = useRef();

  const toggle = () => setOpen(prev => !prev);

  // console.log({ field, list });

  return (
    <div className={`${styles.accordion} ${open ? "open" : "closed"}`}>
      <strong className="flex middle" onClick={toggle}>
        <div className={`${styles.arrow} flex center`} />
        {field}
      </strong>
      {sum && <span>{sum}</span>}
      {list}
    </div>
  );
}
