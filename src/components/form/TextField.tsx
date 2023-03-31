import { ChangeEventHandler } from "react";

type PropsType = {
  field: string;
  placeholder?: string;
  handleChange: ChangeEventHandler<HTMLInputElement>;
  value: any;
};

const TextField = ({
  field,
  placeholder,
  handleChange,
  value,
  ...props
}: PropsType) => {
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
