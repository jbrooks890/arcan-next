import styles from "@/styles/form/Checkbox.module.scss";

export default function Checkbox({
  field,
  handleChange,
  value,
}: InputPropsType) {
  return (
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
}
