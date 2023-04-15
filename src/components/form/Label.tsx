"use client";
import { useState, ReactElement } from "react";
import Criteria from "./Criteria";
import styles from "@/styles/form/Label.module.scss";
import Markdown from "markdown-to-jsx";

export default function Label({
  name,
  field,
  required = false,
  criteria,
  children,
  validated = false,
  inline = false,
  error,
  // id,
  className,
}: InputWrapperType) {
  const [showCriteria, setShowCriteria] = useState(false);

  const toggleCriteria = () => setShowCriteria(prev => !prev);
  // console.log({ showCriteria });

  return (
    <label
      htmlFor={field}
      data-label={name}
      className={`${styles.label} label_ ${
        required ? "required" : "not-required"
      } ${criteria ? "has-criteria" : "no-criteria"} ${
        inline ? "flex inline middle" : "block"
      } ${className ?? "exo"}`}
    >
      <Markdown
        className={`${styles["label-text"]} label-text ${
          required ? "required" : "not-required"
        } ${validated ? "validated" : "not-validated"} ${
          error ? "has-error" : "no-error"
        }`}
        // options={{ forceBlock: true }}
        onClick={() => criteria && toggleCriteria()}
        // data-error={error ?? undefined}
      >
        {name}
      </Markdown>
      {required || criteria ? (
        <span className={`${styles.error}`}>{error ?? ""}</span>
      ) : undefined}
      {criteria ? (
        <Criteria
          content={criteria}
          show={showCriteria}
          toggle={toggleCriteria}
        />
      ) : undefined}
      {children}
    </label>
  );
}
