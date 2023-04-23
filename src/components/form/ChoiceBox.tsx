import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
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

          return (
            <label
              key={i}
              htmlFor={id}
              className={`flex start middle ${
                (multi ? value.includes(option) : option === value)
                  ? "selected"
                  : "not-selected"
              }`}
            >
              <input
                ref={(element: HTMLInputElement) =>
                  (inputs.current[i] = element)
                }
                id={id}
                name={id}
                type={multi ? "checkbox" : "radio"}
                value={display ? index : option}
                checked={
                  multi
                    ? value.includes(display ? index : option)
                    : value === option
                }
                onChange={() =>
                  handleChange(
                    multi
                      ? inputs.current
                          .filter(input => input?.checked)
                          .map(input => input.value)
                      : option
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
