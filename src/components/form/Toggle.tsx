import { ChangeEventHandler } from "react";
import styles from "@/styles/form/Toggle.module.scss";

const Toggle = ({ field, handleChange, value }: InputPropsType) => {
  return (
    <>
      <input
        type="checkbox"
        id={field}
        className={`${styles.input}`}
        name={field}
        onChange={handleChange}
        checked={value ?? false}
      />
      <div className={`${styles.toggle}`} />
    </>
  );
};

export default Toggle;
