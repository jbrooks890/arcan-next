import styles from "@/styles/form/Toggle.module.scss";

export default function Toggle({ field, handleChange, value }: InputPropsType) {
  return (
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
}
