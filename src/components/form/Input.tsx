import {
  HTMLInputTypeAttribute,
  ReactElement,
  forwardRef,
  MutableRefObject,
  ComponentType,
} from "react";
import styles from "@/styles/form/Input.module.scss";
import InputWrapper from "./InputWrapper";

type Props = {
  type: HTMLInputTypeAttribute;
  wrapper?: InputWrapperType;
} & InputPropsType &
  Passthrough;

export default forwardRef<HTMLInputElement, Props>(function Input(
  { type, field, placeholder, handleChange, value, wrapper, id, className },
  ref
) {
  const CONTENT = (
    <div className={`${styles.wrap} flex middle ${className ?? "exo"}`}>
      <input
        ref={ref}
        name={field}
        // id={id}
        className={styles.input}
        type={type}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={handleChange}
      />
    </div>
  );

  return wrapper ? (
    <InputWrapper {...wrapper}>{CONTENT}</InputWrapper>
  ) : (
    CONTENT
  );
});
