import { useRef, useState } from "react";
import styles from "@/styles/form/WordBank.module.scss";

const WordBank = ({
  value = [],
  terms = [...value],
  field,
  handleChange,
}: InputPropsType & { terms: string[] }) => {
  const [entry, setEntry] = useState("");
  const placeholder = field.replace(/([A-Z])/g, " $1");
  const submit = useRef<HTMLButtonElement | null>(null);

  // console.log("VALUE:", { value });

  const addTerm = () => {
    if (entry.length && !terms.includes(entry)) {
      setEntry("");
      handleChange([...terms, entry]);
    }
  };

  const removeTerm = (term: string) =>
    handleChange(terms.filter(entry => entry !== term));

  return (
    <>
      <div className={`${styles["new-wrap"]} flex middle`}>
        <input
          type="text"
          className={styles.new}
          placeholder={`New ${placeholder}`}
          value={entry}
          onChange={e => setEntry(e.currentTarget.value)}
          onKeyDown={e => e.key === "Enter" && submit.current!.click()}
        />
        <button
          ref={submit}
          className="add-word flex center"
          onClick={addTerm}
        />
      </div>
      <ul className={`${styles.cache} flex wrap`}>
        {terms.length ? (
          terms.map((term, i) => (
            <li key={i} className={`${styles.entry} flex middle`}>
              {term}
              <button
                className="delete-entry"
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
};

export default WordBank;
