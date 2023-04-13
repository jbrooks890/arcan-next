import { useRef, useEffect, ReactElement } from "react";
import styles from "@/styles/form/FieldSet.module.scss";

export default function FieldSet({
  field,
  name,
  id,
  className,
  required,
  open = true,
  inline = false,
  error,
  children,
}: InputWrapperType) {
  const fieldset = useRef<HTMLFieldSetElement | null>(null);
  const legend = useRef<HTMLLegendElement | null>(null);

  return (
    <fieldset
      ref={fieldset}
      id={id ?? ""}
      className={`${styles.fieldset} ${className ?? ""} ${
        field ? `${field}-section` : ""
      } group flex ${inline ? "inline" : "col"} ${open ? "open" : "closed"}`}
    >
      <legend ref={legend} className={required ? "required" : ""}>
        {name}
      </legend>
      {children}
    </fieldset>
  );
}
