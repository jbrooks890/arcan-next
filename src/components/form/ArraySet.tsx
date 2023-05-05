import "@/styles/form/ArraySet.css";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import ArraySetEntry from "./ArraySetEntry";
import ArraySetNew from "./ArraySetNew";
import { useDBMaster } from "../contexts/DBContext";
import useTableElement from "@/hooks/useTableElement";
import ObjectNest from "./ObjectNest";
import useOpsCache from "@/hooks/useOpsCache";
import useForm, { FieldType } from "@/hooks/useForm";
import InputWrapper from "./InputWrapper";

type PropsType = {
  ancestors: string[];
  // createNewEntry: Function;
  entryFields: FieldType[];
  cache?: string[];
};

export default function ArraySet({
  field,
  handleChange,
  value = [],
  cache = value,
  ancestors,
  entryFields,
  wrapper,
}: PropsType & InputPropsType) {
  // ===================================================

  // console.log({ entryFields });

  const initialState = {
    draft: value,
    expandNew: false,
    output: "",
  };

  type Action =
    | { type: "update"; payload: string }
    | { type: "expand"; payload: boolean }
    | { type: "toggle" | "reset"; payload?: undefined };

  const reducer = (state: typeof initialState, action: Action) => {
    const { type, payload } = action;
    switch (type) {
      case "update":
        return {
          ...state,
          draft: payload,
        };
      case "expand":
        return {
          ...state,
          expandNew: payload,
        };
      case "toggle":
        return {
          ...state,
          expandNew: !state.expandNew,
        };
      case "reset":
        return initialState;
      default:
        return state;
    }
  };
  // ===================================================
  const [entryDraft, setEntryDraft] = useState();
  // const [expandNew, setExpandNew] = useState(false);
  const [submitDraft, setSubmitDraft] = useState();
  // {{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}
  const [state, dispatch] = useReducer<typeof reducer>(reducer, initialState);
  const { draft, expandNew, output } = state;
  // {{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}
  const { omittedFields } = useDBMaster();
  const { table } = useTableElement();
  const { createButtons } = useOpsCache();
  const { form } = useForm();

  // ---------- RESET ----------

  const resetDraft = () =>
    setEntryDraft(prev =>
      Object.fromEntries(Object.keys(prev).map(path => [path, undefined]))
    );

  // ---------- ADD ----------

  function addEntry() {
    handleChange([...cache, draft]);
    dispatch({ type: "reset" });
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

  const cancel = () => dispatch({ type: "reset" });

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // _________ NEW ENTRY _________
  const newEntry = form({
    name: `New ${
      wrapper?.name?.endsWith("s") ? wrapper.name.slice(0, -1) : "entry"
    }`,
    fields: entryFields,
    subForm: true,
    submitTxt: "Add",
    resetTxt: "Clear",
    handleSubmit: addEntry,
    handleReset: cancel,
  });

  const OUTPUT = draft ? (
    <>
      {newEntry}
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
    <div className="fade">No entry</div>
  );

  // ============================================
  // :::::::::::::::::\ RENDER /:::::::::::::::::
  // ============================================

  return wrapper ? (
    <InputWrapper {...wrapper} group={true}>
      {OUTPUT}
    </InputWrapper>
  ) : (
    OUTPUT
  );
}
