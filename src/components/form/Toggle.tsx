import styles from "@/styles/form/Toggle.module.scss";
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
        id={field}
        className={styles.input}
        name={field}
        onChange={handleChange}
        checked={value ?? false}
      />
      <div className={styles.toggle} />
    </>
  );
  return wrapper ? <InputWrapper {...wrapper}>{OUTPUT}</InputWrapper> : OUTPUT;
}
