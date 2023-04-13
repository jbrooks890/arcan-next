import styles from "@/styles/form/DateField.module.scss";

export default function DateField({
  field,
  value,
  handleChange,
  min,
  max = new Date(),
}: InputPropsType) {
  return (
    <input
      type="date"
      className={styles.input}
      onChange={handleChange}
      min={min as string}
      max={max as string}
      value={value}
    />
  );
}
