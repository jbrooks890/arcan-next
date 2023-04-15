"use client";
import styles from "@/styles/DatabaseView.module.scss";
// import "@/styles/Form.css";
import axios from "@/interfaces/axios";
// import { useState, useEffect } from "react";
import Dropdown from "@/components/form/Dropdown";
import Menu from "@/components/form/Menu";
import Accordion from "@/components/form/Accordion";
import DatabaseDraft from "@/components/pages/admin/DatabaseDraft";
import { ArcanDataType, useDBMaster } from "@/components/contexts/DBContext";
import DBDraftProvider from "@/components/contexts/DBDraftContext";
import ObjectNest from "@/components/form/ObjectNest";
import Prompt from "@/components/frags/Prompt";
import useTableElement from "@/hooks/useTableElement";
import Page from "@/components/layout/Page";
import { useReducer, useState } from "react";

// console.log({ useDBMaster });

type reducerActionType =
  | "changeCollection"
  | "changeRecord"
  | "toggleDraftMode";

type DraftModeParams = {
  record?: string;
  schemaName: string;
  update: any; // TODO
};

const reducer = (
  state,
  action: { type: reducerActionType; payload: any }
) => {};

export default function Database({ params }) {
  const { arcanData, updateArcanData } = useDBMaster();
  const [selection, setSelection] = useState(Object.keys(arcanData?.models)[0]);
  const [entrySelection, setEntrySelection] = useState();
  const [draftMode, setDraftMode] = useState<DraftModeParams | undefined>(
    undefined
  );
  const [state, dispatch] = useReducer(reducer, {
    collection: {}, // SELECTION
    record: {}, // ENTRY SELECTION
    draftMode: undefined,
  });

  const { models, references, collections } = arcanData;
  const collection = collections[selection];
  const { table } = useTableElement();

  console.log({ arcanData });

  // useEffect(() => console.log({ arcanData }), [arcanData]);

  // :::::::::::::\ GET PATH DATA /:::::::::::::

  const getPathData = (ancestors: string[], collection = selection) => {
    // Navigate to the appropriate schema path
    const model = models[collection];

    // SET=
    const set = ancestors.reduce((paths, pathName) => {
      const current = paths[pathName];
      // console.log({ pathName, paths, current });

      if (current) {
        if (current.instance) {
          const { instance } = current;
          if (instance === "Array")
            return current.caster || current.schema.paths;
          if (instance === "Map")
            return current.$__schemaType.options.type.paths;
        }
        return current.options?.type?.paths || current;
      }
      return paths;
    }, model.paths);

    return set;
  };

  // :::::::::::::\ BUILD LIST /:::::::::::::

  const buildList = (obj = {}, ancestors = []) => {
    obj = Object.fromEntries(
      Object.entries(obj).filter(
        ([key]) => !["_id", "id", "createdAt", "updatedAt", "__v"].includes(key)
      )
    );

    return (
      <ul>
        {Object.entries(obj).map(([key, value], i) => {
          const isObject = typeof value === "object";

          const renderEntry = () => {
            const pathData = getPathData([...ancestors, key]);
            const { instance, options } = pathData;
            // const { ref, refPath } = options;
            const reference =
              options?.ref ?? entrySelection?.[options?.refPath];

            // console.log({ ref, refPath });

            return instance === "ObjectID"
              ? references[reference][value]
              : String(value);
          };

          return (
            <li key={i} className={!isObject ? "flex" : ""}>
              {isObject ? (
                <Accordion
                  field={key}
                  list={buildList(value, [...ancestors, key])}
                  mode={Object.keys(value).length < 6}
                />
              ) : (
                <>
                  <strong className={isObject ? "flex middle" : ""}>
                    {key}
                  </strong>
                  <span>
                    {renderEntry()}
                    {/* {String(value)} */}
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  // :::::::::::::\ CANCEL DRAFT /:::::::::::::

  const cancelDraft = () => setDraftMode(null);

  // :::::::::::::\ FETCH ENTRY /:::::::::::::

  const fetchEntry = async entry_id => {
    try {
      const response = await axios.get(`/${selection}/${entry_id}`);
      console.log({ RESPONSE: response.data });
      draftMode && cancelDraft();
      setEntrySelection(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // :::::::::::::\ SELECT COLLECTION /:::::::::::::

  const selectCollection = (name: string) => {
    console.clear();
    draftMode && cancelDraft();
    setSelection(name);
    setEntrySelection("");
  };

  // :::::::::::::\ UPDATE ARCAN DATA /:::::::::::::

  const updateMaster = (newData, collection = selection) => {
    // setArcanData(prev => {
    //   const { _id, name, subtitle, title, username } = newData;

    //   const NAME =
    //     (typeof name === "object" ? name[Object.keys(name)[0]] : name) ??
    //     subtitle ??
    //     title ??
    //     username ??
    //     `${collection}: ${_id}`;

    //   return {
    //     ...prev,
    //     references: {
    //       ...prev.references,
    //       [collection]: { ...prev.references[collection], [_id]: NAME },
    //     },
    //   };
    // });
    updateArcanData(newData, collection);
    setEntrySelection(newData);
  };

  // :::::::::::::\ ADD NEW ENTRY /:::::::::::::
  const addNew = () => {
    setEntrySelection(null);
    setDraftMode({
      schemaName: selection,
      update: updateMaster,
    });
  };

  // :::::::::::::\ DELETE ENTRY /:::::::::::::
  const deleteEntry = async (
    id = entrySelection?._id,
    collection = selection
  ) => {
    try {
      const response = await axios.delete(`/${collection}/${id}`);
      if (response.status === 201) {
        setArcanData(prev => {
          return {
            ...prev,
            references: {
              ...prev.references,
              [collection]: Object.fromEntries(
                Object.entries(prev.references[collection]).filter(
                  ([entryID]) => entryID !== id
                )
              ),
            },
            collections: {
              ...prev.collections,
              [collection]: Object.fromEntries(
                Object.entries(prev.collections[collection]).filter(
                  ([entryID]) => entryID !== id
                )
              ),
            },
          };
        });
        setEntrySelection(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // :::::::::::::\ HOME BUTTON /:::::::::::::
  const toCollectionHome = () => {
    cancelDraft();
    setEntrySelection(undefined);
  };

  // ============================================
  // :::::::::::::::::\ RENDER /:::::::::::::::::
  // ============================================

  console.log(references[selection]);

  return (
    <DBDraftProvider
      state={{
        selection,
        setSelection,
        entrySelection,
        setEntrySelection,
        draftMode,
        setDraftMode,
      }}
    >
      <Page name="Database" type="screen">
        <div className={`${styles.wrapper} flex col middle`}>
          {selection ? (
            <div className={`${styles.home} grid`}>
              {/* ------- COLLECTION SELECTOR ------- */}
              <fieldset className={`${styles.selector} flex middle`}>
                <legend>Collection</legend>
                <Dropdown
                  options={Object.keys(models)}
                  value={selection}
                  handleChange={selectCollection}
                  className={styles.dropdown}
                />
              </fieldset>

              {/* ------- COLLECTION DATA ------- */}
              <fieldset className={`${styles["collection-data"]} flex middle`}>
                <legend>Collection Data</legend>
                <div className={`${styles.cache} flex middle`}>
                  <div>
                    Entries: {Object.keys(references[selection]).length}
                  </div>
                  <button onClick={() => entrySelection && toCollectionHome()}>
                    Home
                  </button>
                  <button>Filter</button>
                </div>
                <button
                  className={`${styles.create} flex middle`}
                  onClick={addNew}
                >
                  New
                </button>
              </fieldset>

              {/* ------- ENTRY MENU ------- */}
              <Menu
                label="Entries"
                options={
                  selection === "User"
                    ? Object.values(references[selection])
                    : Object.keys(references[selection])
                }
                className="col"
                display={
                  selection === "User" ? undefined : references[selection]
                }
                handleChange={entry_id => fetchEntry(entry_id)}
                value={entrySelection?._id}
                id="collection-entry-list"
              />

              {/* ------- ENTRY DATA ------- */}
              <div className={`${styles.viewport} flex col`}>
                {entrySelection || draftMode ? (
                  <>
                    {/* ------- ENTRY HEADER ------- */}
                    <div className={`${styles["entry-header"]} flex`}>
                      <div className={styles["entry-title"]}>
                        <h3
                          className={styles["entry-name"]}
                          data-entry-id={entrySelection?._id ?? undefined}
                        >
                          {references[selection][entrySelection?._id] ??
                            `New ${selection}`}
                        </h3>
                        {entrySelection?._id && (
                          <h5 className={styles["entry-id"]}>
                            {entrySelection?._id}
                          </h5>
                        )}
                      </div>
                      {!draftMode && (
                        <div className={styles["button-cache"]}>
                          <button
                            className={styles.edit}
                            onClick={() =>
                              setDraftMode({
                                record: entrySelection,
                                recordName:
                                  references[selection][entrySelection._id],
                                schemaName: selection,
                                arcanData,
                                updateMaster,
                              })
                            }
                          >
                            Edit
                          </button>
                          <Prompt
                            btnTxt="Delete"
                            message={
                              <>
                                Are you sure you want to delete{" "}
                                <strong>{entrySelection.name}</strong>?
                              </>
                            }
                            options={{ Delete: deleteEntry }}
                            className={styles.delete}
                          />
                        </div>
                      )}
                    </div>
                    <div className={`${styles.body} flex`}>
                      {draftMode ? (
                        <DatabaseDraft {...draftMode} cancel={cancelDraft} />
                      ) : (
                        <ObjectNest
                          dataObj={entrySelection}
                          collectionName={selection}
                          className={`${styles.fields} flex col`}
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <span className="fade">No entries</span>
                )}
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </Page>
    </DBDraftProvider>
  );
}
