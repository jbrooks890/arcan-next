import { ChangeEventHandler, useRef } from "react";

type PropsType = {
  field: string;
  handleChange: ChangeEventHandler<HTMLInputElement>;
  value: any;
  min?: number;
  max?: number;
  step?: number;
};

export default function NumField({
  field,
  handleChange,
  value,
  min,
  max,
  step = 1,
}: PropsType) {
  const isFloat: boolean = step > 0 && step < 1;

  return (
    <input
      type="number"
      // id={field}
      name={field}
      min={min}
      max={max}
      onChange={handleChange}
      // onMouseEnter={e => e.currentTarget.focus()}
      step={step}
      value={value ?? min ?? 0}
    />
  );
}
