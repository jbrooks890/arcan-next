import { ChangeEventHandler } from "react";

type PropsType = {
  field: string;
  handleChange: ChangeEventHandler<HTMLInputElement>;
  value: any;
};

export default function DateField({ field, value, handleChange }: PropsType) {
  return <input type="date" onChange={handleChange} />;
}
