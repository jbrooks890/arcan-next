import styles from "@/styles/Form.module.scss";
import {
  FormEventHandler,
  MouseEvent,
  MouseEventHandler,
  ReactElement,
} from "react";

export type FormType<Data> = {
  name?: string;
  children: ReactElement | ReactElement[] | JSX.Element;
  validate?: boolean;
  autoComplete?: boolean;
  spellCheck?: boolean;
  submitTxt?: string;
  resetTxt?: string;
  useSummary?: boolean;
  handleReset?: MouseEventHandler<HTMLButtonElement>;
  handleCancel?: MouseEventHandler<HTMLButtonElement>;
  handleSubmit: (v?: Data) => void;
  postMessage?: (v: Data) => string;
} & Passthrough;

export default function Form({
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
  useSummary = false,
  validate = false,
}: FormType) {
  return (
    <form
      name={name ?? "anonymous"}
      id={id}
      className={`${styles.form} flex col ${className ?? "exo"} ${
        validate ? "validate" : "no-validate"
      }`}
      onSubmit={handleSubmit}
      autoComplete={autoComplete ? "on" : "off"}
      spellCheck={spellCheck}
    >
      {name && !useSummary && <h2 className={`${styles.title}`}>{name}</h2>}
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
}
