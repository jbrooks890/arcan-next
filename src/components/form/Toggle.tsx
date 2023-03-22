import { ChangeEventHandler } from "react";
import "../../styles/form/Toggle.css";

const Toggle = ({ field, handleChange, value = false }: InputPropsType) => {
  return (
    <>
      <input
        type="checkbox"
        id={field}
        name={field}
        onChange={handleChange}
        checked={value}
      />
      <div className="cb-toggle" />
    </>
  );
};

export default Toggle;
