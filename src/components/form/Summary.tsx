import styles from "@/styles/form/Summary.module.scss";
import { MouseEventHandler } from "react";
import ObjectNest from "./ObjectNest";

type Props = {
  form: {};
  collection: {};
  legend?: string;
  name?: string;
  submitTxt?: string;
  cancelTxt?: string;
  handleSubmit: MouseEventHandler<HTMLButtonElement>;
  handleCancel: MouseEventHandler<HTMLButtonElement>;
} & Passthrough;

export default function Summary({
  form,
  collection,
  id,
  className,
  legend = "Summary",
  name = "Preview",
  submitTxt = "Submit",
  cancelTxt = "cancel",
  handleSubmit,
  handleCancel,
}: Props) {
  // console.log({ name, form });

  return (
    <fieldset
      id={id}
      className={`${styles.summary} flex col ${className ?? "exo"}`}
    >
      <legend>{legend}</legend>
      <h3>{name}</h3>
      <ObjectNest
        dataObj={form}
        collectionName={collection}
        className="wrapper flex col"
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
