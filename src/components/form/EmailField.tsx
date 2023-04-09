import { ChangeEventHandler } from "react";

// type PropsType = {
//   field: string;
//   value: any;
//   placeholder?: string;
//   handleChange: ChangeEventHandler<HTMLInputElement>;
// };

export default function EmailField({
  field,
  value,
  placeholder,
  handleChange,
}: InputPropsType) {
  return (
    <input
      type="email"
      name={field}
      value={value ?? ""}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
}
