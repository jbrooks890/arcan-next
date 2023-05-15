import styles from "@/styles/form/Toggle.module.scss";
import { useState } from "react";
import InputWrapper from "./InputWrapper";

export default function Toggle({
  field,
  handleChange,
  value,
  wrapper,
}: InputPropsType) {
  const OUTPUT = (
    <>
      <input
        type="checkbox"
        name={field}
        id={field}
        className={styles.input}
        onChange={handleChange}
        checked={value}
      />
      <div className={`${styles.toggle} ${value ? "checked" : "unchecked"}`} />
    </>
  );
  return wrapper ? <InputWrapper {...wrapper}>{OUTPUT}</InputWrapper> : OUTPUT;
}
