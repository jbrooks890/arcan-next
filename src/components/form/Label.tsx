"use client";
import { useState, ReactElement } from "react";
import Criteria from "./Criteria";
import styles from "@/styles/form/Label.module.scss";
import Markdown from "markdown-to-jsx";

type PropsType = {
  name: string;
  field: string;
  required?: boolean;
  criteria?: string | string[];
  error?: string;
  children: ReactElement | ReactElement[];
  // id?: string;
  className?: string;
};

export default function Label({
  name,
  field,
  required = false,
  criteria,
  children,
  // id,
  className,
}: PropsType) {
  const [showCriteria, setShowCriteria] = useState(false);

  const toggleCriteria = () => setShowCriteria(prev => !prev);
  // console.log({ showCriteria });

  return (
    <label
      htmlFor={field}
      data-label={name}
      className={`${styles.label} label_ ${
        required ? "required" : "not-required"
      } ${criteria ? "has-criteria" : "no-criteria"} ${className ?? ""}`}
    >
      <Markdown
        className={`${styles["label-text"]} label-text`}
        onClick={() => criteria && toggleCriteria()}
      >
        {name}
      </Markdown>
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
