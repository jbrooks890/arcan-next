import { MouseEventHandler, useRef, useState } from "react";
import styles from "@/styles/form/WordBank.module.scss";
import TextField from "./TextField";
import InputWrapper from "./InputWrapper";

export default function WordBank({
  field,
  value = [],
  handleChange,
  wrapper,
}: InputPropsType & { terms: string[] }) {
  const [entry, setEntry] = useState("");
  const placeholder = field.replace(/([A-Z])/g, " $1");
  const submit = useRef<HTMLButtonElement | null>(null);

  const addTerm: MouseEventHandler = e => {
    e.preventDefault();
    if (entry.length && !value.includes(entry)) {
      setEntry("");
      handleChange([...value, entry]);
    }
  };

  const removeTerm = (term: string) =>
    handleChange(value.filter(entry => entry !== term));

  const OUTPUT = (
    <>
      <div className={`${styles.wrapper} flex middle`}>
        <input
          className={styles.new}
          value={entry}
          placeholder={`New ${placeholder}`}
          onChange={e => setEntry(e.currentTarget.value)}
          // onKeyDown={e => e.key === "Enter" && submit.current!.click()}
        />
        <button
          ref={submit}
          type="button"
          className={`${styles["add-word"]} flex center`}
          onClick={e => addTerm(e)}
        />
      </div>
      <ul className={`${styles.cache} flex wrap`}>
        {value.length ? (
          value.map((term, i) => (
            <li key={i} className={`${styles.entry} flex middle`}>
              {term}
              <button
                className={styles.delete}
                onClick={() => removeTerm(term)}
              />
            </li>
          ))
        ) : (
          <span className="fade">No entries</span>
        )}
      </ul>
    </>
  );

  return wrapper ? <InputWrapper {...wrapper}>{OUTPUT}</InputWrapper> : OUTPUT;
}
