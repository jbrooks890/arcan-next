import { useRef, useState } from "react";
import styles from "@/styles/form/Dropdown.module.scss";

export default function Dropdown({
  options,
  // display,
  field,
  handleChange,
  value,
  other,
  className,
}: SelectType & Passthrough) {
  const [selected, setSelected] = useState(value);
  const [open, setOpen] = useState(false);
  const list = useRef<HTMLUListElement | null>(null);

  const NO_CHOICE = "--";

  const display = !Array.isArray(options);
  const $options = Object.entries(options);

  const selectOption = (selection: string | number) => {
    handleChange(selection);
    setSelected(selection);
    setOpen(false);
  };

  const toggle = () => setOpen(prev => !prev);

  return (
    <label className={`${styles.dropdown} dropdown-ext ${className ?? "exo"}`}>
      <select name={field} style={{ display: "none" }} defaultValue={selected}>
        {$options.map(([_, option], i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className={`${styles.wrapper} wrapper-ext`}>
        <div
          className={`${styles.display} flex middle ${
            open ? "open" : "closed"
          }`}
          onClick={toggle}
        >
          {(selected && String(selected)) ?? NO_CHOICE}
        </div>
        <ul
          className={`${styles.cache} ${open ? "open" : "closed"}`}
          ref={list}
          style={{
            maxHeight: open ? list?.current?.scrollHeight + "px" : undefined,
          }}
          onMouseLeave={() => open && toggle()}
        >
          {$options.map(([index, option], i) => (
            <li
              key={i}
              className={display ? "display" : "plain"}
              data-choice={option}
              data-choice-display={display ? index : undefined}
              onClick={() => selectOption(option)}
            >
              {!option ? NO_CHOICE : display ? index : option}
            </li>
          ))}
          {other && (
            <li data-choice={"other"} onClick={() => selectOption(undefined)}>
              <em>other</em>
            </li>
          )}
        </ul>
      </div>
    </label>
  );
}
