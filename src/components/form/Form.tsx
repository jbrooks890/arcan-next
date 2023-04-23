import styles from "@/styles/Form.module.scss";
import {
  FormEventHandler,
  MouseEvent,
  MouseEventHandler,
  ReactElement,
} from "react";
import FieldSet from "./FieldSet";

export type FormType<Data> = {
  name?: string;
  children: ReactElement | ReactElement[] | JSX.Element;
  validate?: boolean;
  autoComplete?: boolean;
  spellCheck?: boolean;
  submitTxt?: string;
  resetTxt?: string;
  useSummary?: boolean;
  subForm?: boolean;
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
  subForm = false,
  validate = false,
}: FormType) {
  // console.log({ name, subForm });
  const Element = subForm ? FieldSet : "form";
  // const Title = subForm ? "legend" : "h2";

  return (
    <Element
      name={name ?? "anonymous"}
      id={id}
      className={`${subForm ? styles["sub-form"] : styles.form} flex col ${
        validate ? "validate" : "no-validate"
      } ${className ?? "exo"}`}
      onSubmit={handleSubmit}
      autoComplete={autoComplete ? "on" : "off"}
      spellCheck={spellCheck}
    >
      {name && !subForm && <h2 className={`${styles.title}`}>{name}</h2>}
      {children}
      {!useSummary && (
        <>
          <button
            type="submit"
            onClick={(e: MouseEvent<HTMLButtonElement>) => handleSubmit(e)}
          >
            {submitTxt ?? "Submit"}
          </button>
          <button type="reset" onClick={handleReset}>
            {resetTxt ?? "Reset"}
          </button>
        </>
      )}
    </Element>
  );
}
