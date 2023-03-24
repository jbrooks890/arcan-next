import "@/styles/Form.module.css";
import { FormEventHandler, ReactElement } from "react";

type PropsType = {
  name: string;
  children: ReactElement | ReactElement[];
  handleSubmit: FormEventHandler<HTMLFormElement>;
  id?: string;
  className?: string;
  autoComplete?: boolean;
  spellCheck?: boolean;
  validate?: boolean;
};

const Form = ({
  name,
  children,
  handleSubmit = e => e.preventDefault(),
  id,
  className,
  autoComplete = false,
  spellCheck = false,
  validate = false,
}: PropsType) => {
  return (
    <form
      name={name}
      id={id}
      className={`custom-form ${className ?? ""} ${
        validate ? "validate" : "no-validate"
      }`}
      onSubmit={handleSubmit}
      autoComplete={autoComplete ? "on" : "off"}
      spellCheck={spellCheck}
    >
      {children}
    </form>
  );
};

export default Form;
