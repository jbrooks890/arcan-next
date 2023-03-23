import { useState, ReactElement } from "react";
import Criteria from "./Criteria";
import styles from "@/styles/form/Label.module.scss";
import Markdown from "markdown-to-jsx";

type PropsType = {
  name: string;
  field: string;
  required?: boolean;
  criteria?: string;
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

  return (
    <label
      htmlFor={field}
      data-label={name}
      className={`${styles.label} ${className??""} ${
        required ? "required" : "not-required"
      }`}
    >
      <Markdown className={`${styles["label-text"]} label-text`} >{name}</Markdown>
      {criteria ? (
        <Criteria content={criteria} show={showCriteria} />
      ) : undefined}
      {children}
    </label>
  );
}
