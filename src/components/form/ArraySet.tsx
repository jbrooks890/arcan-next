import "@/styles/form/ArraySet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import ArraySetEntry from "./ArraySetEntry";
import ArraySetNew from "./ArraySetNew";
import { useDBMaster } from "../contexts/DBContext";
import useTableElement from "@/hooks/useTableElement";
import ObjectNest from "./ObjectNest";
import useOpsCache from "@/hooks/useOpsCache";
import useForm, { FieldType } from "@/hooks/useForm";

type PropsType = {
  ancestors: string[];
  // createNewEntry: Function;
  newEntry: FieldType[];
  cache?: string[];
};

export default function ArraySet({
  field,
  handleChange,
  value = [],
  cache = value,
  ancestors,
  createNewEntry,
  newEntry,
}: PropsType & InputPropsType) {
  const [entryDraft, setEntryDraft] = useState();
  // const newEntry = useMemo(
  //   () => createNewEntry(entryDraft, setEntryDraft),
  //   [entryDraft]
  // );
  // const [selectedEntries, setSelectedEntries] = useState([]);
  const [expandNew, setExpandNew] = useState(false);
  const [submitDraft, setSubmitDraft] = useState();
  const { omittedFields } = useDBMaster();
  const { table } = useTableElement();
  const { createButtons } = useOpsCache();
  const { render } = useForm();

  console.log({ value, newEntry });

  // console.log({ entryDraft, submitDraft });

  // useEffect(
  //   () =>
  //     setEntryDraft(
  //       Object.fromEntries(newEntry.map(([path, data]) => [path, data.field]))
  //     ),
  //   []
  // );

  // ---------- RESET ----------

  const resetDraft = () =>
    setEntryDraft(prev =>
      Object.fromEntries(Object.keys(prev).map(path => [path, undefined]))
    );

  // ---------- ADD ----------

  function addEntry() {
    handleChange([...cache, entryDraft]);
    resetDraft();
  }

  // ---------- REMOVE ----------

  const removeEntry = entry =>
    handleChange(Object.values(cache).filter(record => record !== entry));

  // ---------- EDIT ----------

  const editEntry = entry => {
    !expandNew && setExpandNew(prev => !prev);
    const index = Object.values(cache).indexOf(entry);
    // console.log({ index, entry });
    // newEntryEm.current.focus();

    setEntryDraft(entry);
    setSubmitDraft(() => update => {
      const mod = [...cache];
      mod[index] = update;
      handleChange(mod);
      resetDraft();
      setSubmitDraft(undefined);
    });
  };

  // ---------- CANCEL ----------

  const cancel = () => {
    resetDraft();
    setExpandNew(false);
    setSubmitDraft(undefined);
  };

  // ============================================
  // :::::::::::::::::\ RENDER /:::::::::::::::::
  // ============================================

  return entryDraft ? (
    <>
      {
        newEntry
        // <ArraySetNew
        //   elements={newEntry.map(field => field[1].element)}
        //   expanded={expandNew}
        //   setExpanded={setExpandNew}
        //   submit={() => (submitDraft ? submitDraft(entryDraft) : addEntry())}
        //   cancel={cancel}
        // />
      }
      {cache.length ? (
        table(cache, {
          omittedFields,
          ancestors,
          headers: Object.keys(Object.values(cache)[0]).filter(
            entry => !omittedFields.includes(entry)
          ),
          contents: entry => {
            return (
              <>
                {createButtons({
                  Edit: () => editEntry(entry),
                  Delete: () => removeEntry(entry),
                })}
                {<ObjectNest dataObj={entry} ancestors={ancestors} />}
              </>
            );
          },
        })
      ) : (
        <span className="fade">No entries</span>
      )}
    </>
  ) : (
    "No entry"
  );
}
