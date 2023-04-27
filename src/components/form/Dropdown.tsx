import { useRef, useState } from "react";
import styles from "@/styles/form/Dropdown.module.scss";

export default function Dropdown<Choices>({
  options,
  // display,
  field,
  handleChange,
  value,
  other,
  className,
}: SelectType<Choices> & Passthrough) {
  const [selected, setSelected] = useState(value);
  const [open, setOpen] = useState(false);
  const list = useRef<HTMLUListElement | null>(null);

  const BLANK = "--";

  const display = !Array.isArray(options);
  const $options = Object.entries(options);

  const selectOption = (selection: any) => {
    handleChange(selection);
    setSelected(selection);
    setOpen(false);
  };

  const toggle = () => setOpen(prev => !prev);

  return (
    <label className={`${styles.dropdown} dropdown-ext ${className ?? "exo"}`}>
      {/* <select name={field} style={{ display: "none" }} defaultValue={selected}>
        {$options.map(([_, option], i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select> */}
      <div className={`${styles.wrapper} wrapper-ext`}>
        {/* ----------| DISPLAY |---------- */}
        <div
          className={`${styles.display} flex middle ${
            open ? "open" : "closed"
          }`}
          onClick={toggle}
        >
          {(selected && String(selected)) ?? BLANK}
        </div>
        {/* ----------| MENU |---------- */}
        <ul
          className={`${styles.cache} ${open ? "open" : "closed"}`}
          ref={list}
          style={{
            maxHeight: open ? list?.current?.scrollHeight + "px" : undefined,
          }}
          onMouseLeave={() => open && toggle()}
        >
          <li className="no-selection" onClick={() => selectOption(undefined)}>
            {BLANK}
          </li>
          {$options.map(([index, option], i) => (
            <li
              key={i}
              className={display ? "display" : "plain"}
              data-choice={option}
              data-choice-display={display ? index : undefined}
              onClick={() => selectOption(option)}
            >
              {display ? index : option}
            </li>
          ))}
          {other && (
            <li data-choice={"other"} onClick={() => selectOption("other")}>
              <em>other</em>
            </li>
          )}
        </ul>
      </div>
    </label>
  );
}
