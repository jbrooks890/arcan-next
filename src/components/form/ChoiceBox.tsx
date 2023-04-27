import { useRef } from "react";
import styles from "@/styles/form/ChoiceBox.module.scss";

type PropsType = SelectType & {
  multi?: boolean;
  inline?: boolean;
};

export default function ChoiceBox({
  options,
  // display,
  field,
  multi = false,
  other = false,
  inline = options.length < 3,
  value = multi ? [] : undefined,
  handleChange,
}: PropsType) {
  const inputs = useRef<HTMLInputElement[]>([]);
  const display = !Array.isArray(options) && typeof options === "object";
  options = Object.entries(options);

  // console.log({ field, value, options });

  return (
    <div
      className={`${styles["choice-box"]} flex ${
        inline ? "inline" : "block col"
      }`}
    >
      {options.length ? (
        options.map(([index, option], i) => {
          const id = `${field}-${option}`;
          // console.log({ field, option });

          const $value = display ? index : option;
          const isActive: boolean = multi
            ? value.includes($value)
            : value === $value;

          // console.log({ isActive });

          return (
            <label
              key={i}
              htmlFor={id}
              className={`flex start middle ${
                isActive ? "selected" : "not-selected"
              }`}
            >
              <input
                ref={(element: HTMLInputElement) =>
                  (inputs.current[i] = element)
                }
                id={id}
                name={id}
                type={multi ? "checkbox" : "radio"}
                value={$value}
                checked={isActive}
                onChange={() =>
                  handleChange(
                    multi
                      ? inputs.current
                          .filter(input => input?.checked)
                          .map(input => input.value)
                      : $value
                  )
                }
              />
              <div
                className={`${styles.ticker} ${multi ? "checkbox" : "radio"}`}
              />
              <div>{option}</div>
            </label>
          );
        })
      ) : (
        <span className="fade">No entries</span>
      )}
    </div>
  );
}
