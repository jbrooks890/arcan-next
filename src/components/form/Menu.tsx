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
  handleChange: Function;
} & Passthrough;

const Menu = ({
  options,
  display,
  label,
  id,
  className,
  field = "selectMenu",
  value,
  searchable = true,
  handleChange,
  ...props
}: PropsType) => {
  const [filter, setFilter] = useState();

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
            {display ? display[option] : option}
          </label>
        </Fragment>
      ))}
    </fieldset>
  );
};

export default Menu;
