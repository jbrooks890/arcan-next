import { useRef, useState } from "react";
import styles from "@/styles/form/Dropdown.module.scss";

type PropsType = {
  options: string[];
  display?: { [key: string]: string };
  field: string;
  value?: any | any[];
  handleChange: Function;
};

export default function Dropdown({
  options,
  display,
  field,
  handleChange,
  value,
}: PropsType) {
  const [selected, setSelected] = useState(value ?? options[0]);
  const [open, setOpen] = useState(false);
  const list = useRef<HTMLUListElement | null>(null);

  const NO_CHOICE = "--";

  const selectOption = (selection: string) => {
    handleChange(selection);
    setSelected(selection);
    setOpen(false);
  };

  const toggle = () => setOpen(prev => !prev);

  return (
    <label className={`${styles.dropdown}`}>
      <select name={field} style={{ display: "none" }} defaultValue={selected}>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className={`${styles.wrapper}`}>
        <div
          className={`${styles.display} flex ${open ? "open" : "closed"}`}
          onClick={toggle}
        >
          {String(selected) || display?.[selected] || NO_CHOICE}
        </div>
        <ul
          className={`option-list ${open ? "open" : ""}`}
          ref={list}
          style={{
            maxHeight: open ? list?.current?.scrollHeight + "px" : undefined,
          }}
          onMouseLeave={() => open && toggle()}
        >
          {options.map((option, i) => (
            <li
              key={i}
              className={display ? "display" : ""}
              data-choice={option}
              data-choice-display={display?.[option]}
              onClick={() => selectOption(option)}
            >
              {!option ? (
                NO_CHOICE
              ) : option === "other" ? (
                <i>{option}</i>
              ) : display ? (
                display[option]
              ) : (
                option
              )}
            </li>
          ))}
        </ul>
      </div>
    </label>
  );
}
