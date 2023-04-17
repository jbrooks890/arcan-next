import { ChangeEventHandler } from "react";

const TextField = ({
  field,
  placeholder,
  handleChange,
  value,
  ...props
}: Omit<InputPropsType, "min" | "max">) => {
  return (
    <input
      name={field}
      type="text"
      placeholder={placeholder}
      value={value ?? ""}
      onChange={handleChange}
      // onBlur={() => required && validator()}
      {...props}
    />
  );
};

export default TextField;
