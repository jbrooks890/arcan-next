import type { FieldType } from "@/hooks/useForm";
import { ReactElement, useEffect, useRef, useState } from "react";

type Props = {
  option: any;
  secondaries: ReactElement | ReactElement[];
  field: string;
  multi: boolean;
  checked: boolean;
  handleChange: Function;
  setRef: Function;
} & Passthrough;

export default function DataSetItem({
  option,
  secondaries,
  field,
  multi,
  checked,
  handleChange,
  setRef,
}: Props) {
  const [open, setOpen] = useState(false);
  const drawer = useRef<HTMLDivElement | null>(null);

  // useEffect(() => console.log({ checked }), []);

  return (
    <div className="wrapper">
      <div
        className={`entry-header flex middle ${open ? "open" : "closed"}`}
        onClick={() => setOpen(prev => !prev)}
      >
        <label htmlFor={option} className="flex middle">
          <input
            ref={element => setRef(element)}
            id={option}
            name={field}
            type={multi ? "checkbox" : "radio"}
            value={option}
            checked={checked}
            onChange={() => handleChange()}
          />
          <div className={`ticker ${multi ? "checkbox" : "radio"}`} />
          <span>{option}</span>
        </label>
        <button className="arrow" onClick={() => setOpen(prev => !prev)} />
      </div>
      <div
        ref={drawer}
        className={`drawer ${open ? "open" : "closed"}`}
        style={{
          maxHeight: open ? drawer.current?.scrollHeight + "px" : undefined,
        }}
      >
        {secondaries}
      </div>
    </div>
  );
}
