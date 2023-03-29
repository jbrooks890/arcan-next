import styles from "@/styles/Form.module.scss";
import { FormEventHandler, MouseEvent, ReactElement } from "react";

type PropsType = {
  name: string;
  children: ReactElement | ReactElement[];
  handleSubmit: FormEventHandler<HTMLFormElement>;
  handleReset?: FormEventHandler<HTMLFormElement>;
  id?: string;
  className?: string;
  submitTxt?: string;
  resetTxt?: string;
  autoComplete?: boolean;
  spellCheck?: boolean;
  validate?: boolean;
  postSubmitMsg?: string;
};

const Form = ({
  name,
  children,
  handleSubmit = e => e.preventDefault(),
  handleReset = e => e.preventDefault(),
  id,
  className,
  submitTxt = "Submit",
  resetTxt = "Reset",
  autoComplete = false,
  spellCheck = false,
  validate = false,
}: PropsType) => {
  return (
    <form
      name={name}
      id={id}
      className={`${styles.form} ${className ?? ""} ${
        validate ? "validate" : "no-validate"
      }`}
      onSubmit={handleSubmit}
      autoComplete={autoComplete ? "on" : "off"}
      spellCheck={spellCheck}
    >
      <h2 className={`${styles.title}`}>{name}</h2>
      {children}
      <button
        type="submit"
        onClick={(e: MouseEvent<HTMLButtonElement>) => handleSubmit(e)}
      >
        {submitTxt ?? "Submit"}
      </button>
      <button type="reset" onClick={handleReset}>
        {resetTxt ?? "Reset"}
      </button>
    </form>
  );
};

export default Form;
