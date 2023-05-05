import { useRef, useState } from "react";
import styles from "@/styles/form/Dropdown.module.scss";

export default function Dropdown<Choices>({
  options,
  // display,
  field,
  handleChange,
  handleOther,
  value,
  other,
  className,
  wrapper,
}: SelectType<Choices> & Passthrough) {
  const [selected, setSelected] = useState<typeof value | "other">(value);
  const [open, setOpen] = useState(false);
  const displayRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const $OTHER = "other";

  const BLANK = "--";

  const display = !Array.isArray(options);
  const $options = Object.entries(options);

  const selectOption = (selection: any) => {
    other && handleOther!(false);
    handleChange(selection);
    setSelected(selection);
    setOpen(false);
  };

  const toggle = () => setOpen(prev => !prev);

  const posList = () => {
    const listHeight = listRef.current?.scrollHeight;
    const displayRect = displayRef.current?.getBoundingClientRect();
  };

  return (
    <label className={`${styles.dropdown} dropdown-ext ${className ?? "exo"}`}>
      <div ref={displayRef} className={`${styles.wrapper} wrapper-ext`}>
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
          ref={listRef}
          style={{
            maxHeight: open ? listRef?.current?.scrollHeight + "px" : undefined,
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
            <li
              data-choice={$OTHER}
              onClick={() => {
                handleOther!(true);
                setSelected($OTHER);
                setOpen(false);
              }}
            >
              <em>other</em>
            </li>
          )}
        </ul>
      </div>
    </label>
  );
}
