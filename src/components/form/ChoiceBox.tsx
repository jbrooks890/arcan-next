import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "@/styles/form/ChoiceBox.module.scss";

type PropsType = {
  options: string[];
  display?: { [key: string]: string };
  field: string;
  multi?: boolean;
  inline?: boolean;
  value?: any | any[];
  handleChange: Function;
};

export default function ChoiceBox({
  options,
  display,
  field,
  multi = false,
  inline = options.length < 4,
  value = multi ? [] : undefined,
  handleChange,
}: PropsType) {
  const inputs = useRef<HTMLInputElement[]>([]);

  return (
    <div
      className={`${styles["choice-box"]} flex ${
        inline ? "inline" : "block col"
      }`}
    >
      {options.length ? (
        options.map((option, i) => {
          const id = `${field}-${option}`;
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
                value={option}
                checked={multi ? value.includes(option) : option === value}
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
              <div>{display ? display[option] : option}</div>
            </label>
          );
        })
      ) : (
        <span className="fade">No entries</span>
      )}
    </div>
  );
}
