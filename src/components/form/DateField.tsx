import styles from "@/styles/form/DateField.module.scss";
import { useReducer } from "react";

type State = {
  m: number;
  d: number;
  y: number;
};

type Action = { type: any; payload: any };

const reducer = (state: State, action: Action) => {
  const { type, payload } = action;
  switch (type) {
    default:
      return state;
  }
};

export default function DateField({
  value = new Date(),
  handleChange,
  min,
  max = new Date(),
  wrapper,
}: { value: Date; min: Date; max: Date } & InputPropsType) {
  const [state, dispatch] = useReducer(reducer, {
    m: 0,
    d: 0,
    y: 0,
  });

  // const fields = [
  //   {
  //     $: "month",
  //     value: value.getMonth().toString().padStart(2, "0"),
  //     placeholder: "MM",
  //     min: min?.getMonth(),
  //     max: max?.getMonth(),
  //   },
  // ];

  const fields = ["month", "date", "year"].map(field => (
    <div key={field} className={styles.shell}>
      <input
        type="number"
        className={styles[field]}
        placeholder={
          field === "month"
            ? "MM"
            : field === "date"
            ? "DD"
            : field === "year"
            ? "YYYY"
            : undefined
        }
        value={
          field === "month"
            ? value.getMonth() + 1 ?? new Date().getMonth() + 1
            : field === "date"
            ? value?.getDate() ?? new Date().getDate()
            : field === "year"
            ? value?.getFullYear() ?? new Date().getFullYear()
            : undefined
        }
        min={
          field === "month"
            ? min?.getMonth() + 1 ?? 1
            : field === "date"
            ? min?.getDate() ?? 1
            : field === "year"
            ? min?.getFullYear() ?? new Date().getFullYear() - 10
            : undefined
        }
        max={
          field === "month"
            ? max?.getMonth() + 1 ?? 1
            : field === "date"
            ? max?.getDate() ?? 1
            : field === "year"
            ? max?.getFullYear() ?? new Date().getFullYear() + 10
            : undefined
        }
        maxLength={field !== "year" ? 2 : 4}
        // value={"02"}
      />
    </div>
  ));

  return (
    <div className={`${styles.wrap} flex middle justify`}>
      {/* {fields} */}
      <div className={styles.shell}>
        <input
          type="number"
          className={styles.month}
          placeholder="MM"
          min={1}
          max={12}
          maxLength={2}
          // value={"02"}
        />
      </div>
      <span />
      <div className={styles.shell}>
        <input
          type="number"
          className={styles.date}
          placeholder="DD"
          min={1}
          max={12}
          maxLength={2}
        />
      </div>
      <span />
      <div className={styles.shell}>
        <input
          type="number"
          className={styles.year}
          placeholder="YYYY"
          min={new Date().getFullYear() - 10}
          max={new Date().getFullYear() + 10}
          defaultValue={new Date().getFullYear()}
          // value={new Date().getFullYear()}
          maxLength={4}
        />
      </div>
      <div className={styles.widget}>
        <div className={styles.wrapper}>
          <button />
          <button />
        </div>
      </div>
    </div>
  );
}
