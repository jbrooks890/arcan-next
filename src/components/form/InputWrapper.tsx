import styles from "@/styles/form/InputWrapper.module.scss";
import Markdown from "markdown-to-jsx";
import { useRef, useState } from "react";
import Criteria from "./Criteria";

export default function InputWrapper({
  name,
  field,
  required = false,
  criteria,
  children,
  validated = false,
  inline = false,
  error,
  group = false,
  open = true,
  id = field,
  className,
}: InputWrapperType) {
  const [showCriteria, setShowCriteria] = useState(false);

  const toggleCriteria = () => setShowCriteria(prev => !prev);
  const Wrapper = group ? "fieldset" : "label";
  const Label = group ? "legend" : Markdown;
  // const wrapRef = useRef<HTMLLabelElement | HTMLFieldSetElement | null>(null);
  // const labelRef = useRef<
  //   HTMLLegendElement | HTMLSpanElement | HTMLDivElement | null
  // >(null);

  return (
    <Wrapper
      // ref={wrapRef}
      htmlFor={field}
      data-label={name}
      id={group && id ? id : undefined}
      className={`${group ? styles.fieldset : styles.label} ${
        required ? "required" : "not-required"
      } ${criteria ? "has-criteria" : "no-criteria"} ${
        inline ? "flex inline middle" : "block"
      } ${open ? "open" : "closed"} ${className ?? "exo"}`}
    >
      <Label
        // ref={labelRef}
        className={`${styles["label-text"]} label-text ${
          required ? "required" : "not-required"
        } ${validated ? "validated" : "not-validated"} ${
          error ? "has-error" : "no-error"
        }`}
        onClick={() => criteria && toggleCriteria()}
      >
        {name}
      </Label>
      {criteria ? (
        <Criteria
          content={criteria}
          show={showCriteria}
          toggle={toggleCriteria}
        />
      ) : undefined}
      {children}
    </Wrapper>
  );
}
