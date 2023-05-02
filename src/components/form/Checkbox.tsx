import styles from "@/styles/form/Checkbox.module.scss";
import InputWrapper from "./InputWrapper";

export default function Checkbox({
  field,
  handleChange,
  value,
  wrapper,
}: InputPropsType) {
  const OUTPUT = (
    <>
      <input
        type="checkbox"
        id={field}
        className={styles.checkbox}
        name={field}
        onChange={handleChange}
        checked={value ?? false}
      />
      <div className={`${styles.checkmark} flex center`} />
    </>
  );
  return wrapper ? <InputWrapper {...wrapper}>{OUTPUT}</InputWrapper> : OUTPUT;
}
