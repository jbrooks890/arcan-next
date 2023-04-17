import { Dispatch, MouseEventHandler, SetStateAction } from "react";
import FieldSet from "./FieldSet";
import styles from "@/styles/form/FormItemNew.module.scss";

type PropsType = {
  elements: string[];
  submit: MouseEventHandler<HTMLButtonElement>;
  cancel: MouseEventHandler<HTMLButtonElement>;
  submitTxt: string;
  cancelTxt: string;
  expanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
};

export default function FormItemNew({
  elements,
  submit,
  cancel,
  submitTxt = "Submit",
  cancelTxt = "Cancel",
  expanded,
  setExpanded,
}: PropsType) {
  const toggle = () => setExpanded(prev => !prev);

  return (
    <FieldSet
      name="New"
      className={`${styles["form-item-new"]} col`}
      open={expanded}
    >
      {expanded ? (
        <>
          {elements}
          <button className={`${styles.add} flex center`} onClick={submit}>
            {submitTxt}
          </button>
          <button className={styles.cancel} onClick={cancel}>
            {cancelTxt}
          </button>
        </>
      ) : (
        <button className={styles.create} onClick={toggle}>
          Add New
        </button>
      )}
    </FieldSet>
  );
}
