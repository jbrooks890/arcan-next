import { useRef, useEffect, ReactElement } from "react";
import styles from "@/styles/form/FieldSet.module.scss";

type PropsType = {
  name: string;
  field: string;
  required?: boolean;
  criteria?: string | string[];
  error?: string;
  id?: string;
  className?: string;
  open?: boolean;
  children: ReactElement | ReactElement[];
};

export default function FieldSet({
  field,
  name,
  id,
  className,
  required,
  open = true,
  children,
}: PropsType) {
  const fieldset = useRef<HTMLFieldSetElement | null>(null);
  const legend = useRef<HTMLLegendElement | null>(null);

  return (
    <fieldset
      ref={fieldset}
      id={id ?? ""}
      className={`${styles.fieldset} ${className ?? ""} ${
        field ? `${field}-section` : ""
      } group flex ${open ? "open" : "closed"}`}
    >
      <legend ref={legend} className={required ? "required" : ""}>
        {name}
      </legend>
      {children}
    </fieldset>
  );
}
