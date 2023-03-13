import { Fragment, useState } from "react";
import "../../styles/form/SelectMenu.css";
import Search from "./Search";

type PropsType = {
  options: string[];
  display?: { [key: string]: string };
  label?: string;
  id?: string;
  className?: string;
  field?: string;
  value?: any;
  searchable?: boolean;
  handleChange: Function;
};

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
      className={`select-menu ${className ? className : ""} flex`}
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
