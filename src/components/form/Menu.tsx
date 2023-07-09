import { Fragment, useState } from "react";
import styles from "@/styles/form/Menu.module.scss";
import Search from "./Search";

type PropsType = {
  options: string[];
  display?: { [key: string]: string };
  label?: string;
  field?: string;
  value?: any;
  searchable?: boolean;
  sort?: boolean;
  handleChange: Function;
} & Passthrough;

export default function Menu({
  options,
  display,
  label,
  id,
  className,
  field = "selectMenu",
  value,
  searchable = true,
  sort = true,
  handleChange,
  ...props
}: PropsType) {
  const [filter, setFilter] = useState();
  if (sort) {
    display
      ? options.sort((prev, curr) => {
          return display[prev] > display[curr] ? 1 : -1;
        })
      : options.sort();
  }

  console.log({ display });

  return (
    <fieldset
      id={id}
      className={`${styles.menu} flex ${className ?? "exo"}`}
      {...props}
    >
      {label && <legend>{label}</legend>}
      {searchable && <Search />}
      {options.map((option, i) => (
        <Fragment key={i}>
          <input
            id={option}
            name={field}
            type="radio"
            value={option}
            checked={option === value}
            onChange={() => handleChange(option)}
          />

          <label htmlFor={option} tabIndex={0}>
            {display?.[option] ?? option}
          </label>
        </Fragment>
      ))}
    </fieldset>
  );
}
