import { ChangeEventHandler, useRef, useState } from "react";
import styles from "@/styles/form/Password.module.scss";

export default function Password({
  field,
  value,
  handleChange,
}: InputPropsType) {
  const [showing, setShowing] = useState(false);
  const input = useRef<HTMLInputElement | null>(null);

  const toggle = () => setShowing(prev => !prev);

  const ShowPassword = () => (
    <button
      className={`${styles.show} ${
        showing ? "active" : "inactive"
      } show-password flex center symbol-font`}
      type="button"
      onClick={e => {
        e.preventDefault();
        setShowing(prev => !prev);
      }}
      tabIndex={0}
    >
      I
    </button>
  );

  return (
    <div className={`${styles.password} password-wrap flex center`}>
      <input
        ref={input}
        type={showing ? "text" : "password"}
        name={field}
        id={field}
        className={showing ? "showing" : "hidden"}
        onChange={handleChange}
        onBlur={() => showing && toggle()}
        value={value ?? ""}
      />
      <ShowPassword />
    </div>
  );
}
