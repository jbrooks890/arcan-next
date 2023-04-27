import { HTMLInputTypeAttribute, ReactElement } from "react";
import styles from "@/styles/form/Input.module.scss";

type Props = {
  // type: InputHTMLAttributes<HTMLInputElement>.type?: HTMLInputTypeAttribute | undefined
  type: HTMLInputTypeAttribute;
  Wrapper?: ReactElement<InputWrapperType>;
} & InputPropsType &
  Passthrough;

export default function Input({
  type,
  field,
  placeholder,
  handleChange,
  value,
  Wrapper,
  id,
  className,
}: Props) {
  const CONTENT = (
    <div className={`${styles.wrap}`}>
      <input
        name={field}
        type={type}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={handleChange}
      />
    </div>
  );
  return Wrapper ? <Wrapper>{CONTENT}</Wrapper> : CONTENT;
}
