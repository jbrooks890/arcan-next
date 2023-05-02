import styles from "@/styles/Form.module.scss";
import type { SummaryType } from "./Summary";

import {
  FormEventHandler,
  MouseEvent,
  MouseEventHandler,
  ReactElement,
} from "react";
import FieldSet from "./FieldSet";
import InputWrapper from "./InputWrapper";

export type FormType<Data> = {
  name?: string;
  children: ReactElement | ReactElement[] | JSX.Element;
  validate?: boolean;
  autoComplete?: boolean;
  spellCheck?: boolean;
  submitTxt?: string;
  resetTxt?: string;
  summary?: SummaryType;
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
  summary,
  subForm = false,
  validate = false,
}: FormType) {
  // console.log({ name, subForm });
  const Element = subForm ? InputWrapper : "form";
  // const Title = subForm ? "legend" : "h2";

  return (
    <Element
      name={name ?? "anonymous"}
      id={id}
      className={`${subForm ? "sub-form" : styles.form} flex ${
        validate ? "validate" : "no-validate"
      } ${className ?? "exo"}`}
      onSubmit={handleSubmit}
      autoComplete={autoComplete ? "on" : "off"}
      spellCheck={spellCheck}
      group={subForm ? true : undefined}
    >
      <div className={`${styles.body} flex col`}>
        {name && !subForm && !summary && (
          <h2 className={styles.title}>{name}</h2>
        )}
        {children}
      </div>
      {!summary && (
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
