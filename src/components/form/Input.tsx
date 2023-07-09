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
  {
    type,
    field,
    placeholder,
    handleChange,
    value,
    wrapper,
    id,
    className,
    step,
  },
  ref
) {
  const convert = (value: string) => {
    switch (type) {
      case "number":
        const parse = step ? parseFloat : parseInt;
        return parse(value);
      // case "float":
      //   return parseFloat(value);
      default:
        return value;
    }
  };

  const CONTENT = (
    <div
      className={`${styles.wrap} ${
        wrapper ? "wrapped" : "not-wrapped"
      } input-container flex middle ${className ?? "exo"}`}
    >
      <input
        ref={ref}
        name={field}
        // id={id}
        className={styles.input}
        type={type}
        placeholder={placeholder}
        value={value ?? ""}
        step={step}
        onChange={e => handleChange(convert(e.currentTarget.value))}
      />
    </div>
  );

  return wrapper ? (
    <InputWrapper {...wrapper}>{CONTENT}</InputWrapper>
  ) : (
    CONTENT
  );
});
