import {
  HTMLInputTypeAttribute,
  ReactElement,
  forwardRef,
  MutableRefObject,
  ComponentType,
} from "react";
import styles from "@/styles/form/Input.module.scss";

type Props = {
  // type: InputHTMLAttributes<HTMLInputElement>.type?: HTMLInputTypeAttribute | undefined
  type: HTMLInputTypeAttribute;
  // Wrapper?: ReactElement<InputWrapperType>;
  Wrapper?: [ComponentType<InputWrapperType>, InputWrapperType];
} & InputPropsType &
  Passthrough;

export default forwardRef<HTMLInputElement, Props>(function Input(
  { type, field, placeholder, handleChange, value, Wrapper, id, className },
  ref
) {
  const CONTENT = (
    <div className={`${styles.wrap} flex middle ${className ?? "exo"}`}>
      <input
        ref={ref}
        name={field}
        type={type}
        className={styles.input}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={handleChange}
      />
    </div>
  );

  if (Wrapper) {
    const [Wrap, props] = Wrapper;
    return <Wrap {...props}>{CONTENT}</Wrap>;
  } else {
    return CONTENT;
  }
});
