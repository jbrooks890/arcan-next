import { ChangeEventHandler, useRef, useState } from "react";

// type PropsType = {
//   field: string;
//   handleChange: ChangeEventHandler<HTMLInputElement>;
//   value: any;
// };

export default function Password({
  field,
  value,
  handleChange,
}: InputPropsType) {
  const [showing, toggleShowing] = useState(false);

  const ShowPassword = () => (
    <button
      className="show-password flex center symbol-font"
      type="button"
      onClick={e => {
        e.preventDefault();
        toggleShowing(prev => !prev);
      }}
      tabIndex={-1}
    >
      I
    </button>
  );

  return (
    <div
      className="password-wrap flex middle"
      style={{ position: "relative", boxSizing: "border-box" }}
    >
      <input
        type={showing ? "text" : "password"}
        name={field}
        id={field}
        className={showing ? "showing" : ""}
        onChange={handleChange}
        value={value}
      />
      <ShowPassword />
    </div>
  );
}
