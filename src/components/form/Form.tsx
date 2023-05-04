import styles from "@/styles/Form.module.scss";
import type { SummaryType } from "./Summary";

import {
  FormEventHandler,
  MouseEvent,
  MouseEventHandler,
  ReactElement,
  ReactNode,
} from "react";
import InputWrapper from "./InputWrapper";
import Summary from "./Summary";

export type FormType<Data> = {
  name?: string;
  children: ReactNode;
  validate?: boolean;
  autoComplete?: boolean;
  spellCheck?: boolean;
  submitTxt?: string;
  resetTxt?: string;
  summary?: Data;
  subForm?: boolean;
  postMessage?: (v: Data) => string;
  handleReset?: MouseEventHandler<HTMLButtonElement>;
  handleCancel?: () => void;
  handleSubmit: (v?: Data) => void;
} & Passthrough;

export default function Form<T>({
  name,
  children,
  id,
  className,
  submitTxt = "Submit",
  resetTxt = "Reset",
  autoComplete = false,
  spellCheck = false,
  summary,
  subForm = false,
  validate = false,
  handleReset,
  handleCancel,
  handleSubmit,
}: FormType<T>) {
  // console.log({ name, subForm });
  const Element = subForm ? InputWrapper : "form";
  // const Title = subForm ? "legend" : "h2";

  return (
    <Element
      name={name ?? "anonymous"}
      id={id}
      className={`${subForm ? "sub-form" : styles.form} flex ${
        summary ? "inline" : "col"
      } ${validate ? "validate" : "no-validate"} ${
        summary ? "summary" : "no-summary"
      } ${className ?? "exo"}`}
      onSubmit={handleSubmit}
      autoComplete={autoComplete ? "on" : "off"}
      spellCheck={spellCheck}
      group={subForm ? true : undefined}
    >
      <div
        className={`${styles.body} ${
          summary ? "summary" : "no-summary"
        } flex col`}
      >
        {name && !subForm && !summary && (
          <h2 className={styles.title}>{name}</h2>
        )}
        {children}
      </div>
      {summary ? (
        <Summary
          data={summary}
          name={name}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
        />
      ) : (
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
