import { useRef, useState } from "react";
import styles from "@/styles/form/Dropdown.module.scss";

export default function Dropdown({
  options,
  display,
  field,
  handleChange,
  value,
  other,
}: SelectType) {
  const [selected, setSelected] = useState(value);
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
          {(selected && String(selected)) ?? (display?.[selected] || NO_CHOICE)}
        </div>
        <ul
          className={`${styles.cache} ${open ? "open" : "closed"}`}
          ref={list}
          style={{
            maxHeight: open ? list?.current?.scrollHeight + "px" : undefined,
          }}
          onMouseLeave={() => open && toggle()}
        >
          {options.map((option, i) => (
            <li
              key={i}
              className={display ? "display" : "plain"}
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
