import type { FieldType } from "@/hooks/useForm";
import useForm from "@/hooks/useForm";
import { ReactElement, useEffect, useRef, useState } from "react";
import styles from "@/styles/form/DataSetItem.module.scss";

type Props = {
  option: any;
  secondaries: ReactElement | ReactElement[];
  field: string;
  multi: boolean;
  checked: boolean;
  handleChange: Function;
  setRef: Function;
} & Passthrough;

export default function DataSetItem({
  option,
  secondaries,
  field,
  multi,
  checked,
  handleChange,
  setRef,
}: Props) {
  const [open, setOpen] = useState(false);
  const drawer = useRef<HTMLDivElement | null>(null);

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.header} flex middle ${open ? "open" : "closed"}`}
        onClick={() => setOpen(prev => !prev)}
      >
        <label htmlFor={field} className="flex middle">
          <input
            ref={element => setRef(element)}
            id={field}
            name={field}
            type={multi ? "checkbox" : "radio"}
            value={option}
            checked={checked}
            onChange={() => handleChange()}
          />
          <div className={`${styles.ticker} ${multi ? "checkbox" : "radio"}`} />
          <span>{option}</span>
        </label>
        <button
          className={styles.arrow}
          onClick={() => setOpen(prev => !prev)}
        />
      </div>
      <div
        ref={drawer}
        className={`${styles.drawer} ${open ? "open" : "closed"}`}
        style={{
          maxHeight: open ? drawer.current?.scrollHeight + "px" : undefined,
        }}
      >
        {secondaries}
      </div>
    </div>
  );
}
