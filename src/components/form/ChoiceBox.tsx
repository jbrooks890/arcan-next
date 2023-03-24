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
  fieldPath: string;
  required: boolean;
  single?: boolean;
  label: string;
  className: string;
  value?: any | any[];
  handleChange: Function;
};

export default function ChoiceBox({
  options,
  display,
  field,
  fieldPath,
  required,
  single = true,
  label,
  className,
  value = [],
  handleChange,
}: PropsType) {
  const inputs = useRef<HTMLInputElement[]>([]);

  return (
    <fieldset
      className={`${styles["choice-box"]} choice-box ${className ?? ""} ${
        options.length > 3 ? "scroll" : "no-scroll"
      } flex col`}
    >
      <legend className={required ? "required" : "not-required"}>
        {label}
      </legend>
      {options.length ? (
        options.map((option, i) => {
          const id = `${fieldPath}-${option}`;
          return (
            <label key={i} htmlFor={id} className="flex start middle">
              <input
                ref={(element: HTMLInputElement) =>
                  (inputs.current[i] = element)
                }
                id={id}
                name={id}
                type={single ? "radio" : "checkbox"}
                value={option}
                checked={option === value || value.includes(option)}
                onChange={() =>
                  handleChange(
                    single
                      ? option
                      : inputs.current
                          .filter(input => input?.checked)
                          .map(input => input.value)
                  )
                }
              />
              <div className={`ticker ${single ? "radio" : "checkbox"}`} />
              <div>{display ? display[option] : option}</div>
            </label>
          );
        })
      ) : (
        <span className="fade">No entries</span>
      )}
    </fieldset>
  );
}
