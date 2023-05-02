import styles from "@/styles/form/Summary.module.scss";
import { MouseEventHandler } from "react";
import ObjectNest from "./ObjectNest";

export type SummaryType = {
  data: {};
  legend?: string;
  name?: string;
  submitTxt?: string;
  cancelTxt?: string;
  handleSubmit: MouseEventHandler<HTMLButtonElement>;
  handleCancel: MouseEventHandler<HTMLButtonElement>;
} & Passthrough;

export default function Summary({
  data,
  id,
  className,
  legend = "Summary",
  name = "Preview",
  submitTxt = "Submit",
  cancelTxt = "cancel",
  handleSubmit,
  handleCancel,
}: SummaryType) {
  // console.log({ name, data });

  return (
    <fieldset
      id={id}
      className={`${styles.summary} flex col ${className ?? "exo"}`}
    >
      <legend>{legend}</legend>
      <h3>{name}</h3>
      <ObjectNest
        dataObj={data}
        // collectionName={collection}
        className={`${styles.wrapper} flex col`}
      />
      <button type="submit" className={styles.submit} onClick={handleSubmit}>
        {submitTxt}
      </button>
      <button className={styles.cancel} onClick={handleCancel}>
        {cancelTxt}
      </button>
    </fieldset>
  );
}
