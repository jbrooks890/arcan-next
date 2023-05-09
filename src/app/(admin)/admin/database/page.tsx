"use client";
import styles from "@/styles/DatabaseView.module.scss";
import axios from "@/interfaces/axios";
import Dropdown from "@/components/form/Dropdown";
import Menu from "@/components/form/Menu";
import DatabaseDraft from "@/components/pages/admin/DatabaseDraft";
import { ArcanDataType, useDBMaster } from "@/components/contexts/DBContext";
import Cascade from "@/components/form/Cascade";
import Prompt from "@/components/frags/Prompt";
import useTableElement from "@/hooks/useTableElement";
import Page from "@/components/layout/Page";
import { prune } from "@/lib/utility";
import { useDBDraft } from "@/components/contexts/DBDraftContext";

export default function Database() {
  const { arcanData, omittedFields } = useDBMaster();
  const { models, references } = arcanData;
  const { draft, updateDraft, fetchRecord } = useDBDraft();
  const { table } = useTableElement();

  console.log({ arcanData });

  // :::::::::::::\ DELETE ENTRY /:::::::::::::
  const deleteEntry = async (
    id = draft.record?._id,
    collection = draft.collection
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

  // ============================================
  // :::::::::::::::::\ RENDER /:::::::::::::::::
  // ============================================

  return (
    <Page name="Database" type="screen">
      <div className={`${styles.wrapper} flex col middle`}>
        {draft.collectionName ? (
          <div className={`${styles.home} grid`}>
            {/* ------- COLLECTION SELECTOR ------- */}
            <fieldset className={`${styles.selector} flex middle`}>
              <legend>Collection</legend>
              <Dropdown
                options={Object.keys(models)}
                value={draft.collectionName}
                handleChange={entry =>
                  updateDraft({ type: "switch", payload: entry })
                }
                className={styles.dropdown}
              />
            </fieldset>

            {/* ------- COLLECTION DATA ------- */}
            <fieldset className={`${styles["collection-data"]} flex middle`}>
              <legend>Collection Data</legend>
              <div className={`${styles.cache} flex middle`}>
                <div>
                  Entries:{" "}
                  {Object.keys(references[draft.collectionName]).length}
                </div>
                <button
                  onClick={() =>
                    draft.record && updateDraft({ type: "goHome" })
                  }
                >
                  Home
                </button>
                <button>Filter</button>
              </div>
              <button
                className={`${styles.create} flex middle`}
                onClick={() => updateDraft({ type: "create" })}
              >
                New
              </button>
            </fieldset>

            {/* ------- ENTRY MENU ------- */}
            <Menu
              label="Entries"
              options={
                draft.collectionName === "User"
                  ? Object.values(references[draft.collectionName])
                  : Object.keys(references[draft.collectionName])
              }
              className="col"
              display={
                draft.collectionName === "User"
                  ? undefined
                  : references[draft.collectionName]
              }
              handleChange={entry_id => fetchRecord(entry_id)}
              value={draft.record?._id}
              id="collection-entry-list"
            />

            {/* ------- ENTRY DATA ------- */}
            <fieldset className={`${styles.viewport} flex col`}>
              <legend>Entry Data</legend>
              {draft.active || draft.record ? (
                <>
                  {/* ------- ENTRY HEADER ------- */}
                  <div className={`${styles["entry-header"]} flex`}>
                    <div className={styles["entry-title"]}>
                      <h3
                        className={styles["entry-name"]}
                        data-entry-id={draft.record?._id ?? undefined}
                      >
                        {references[draft.collectionName][draft.record?._id] ??
                          `New ${draft.collectionName}`}
                      </h3>
                      {draft.record?._id && (
                        <h5 className={styles["entry-id"]}>
                          {draft.record?._id}
                        </h5>
                      )}
                    </div>
                    {!draft.active && (
                      <div className={styles["button-cache"]}>
                        <button
                          className={styles.edit}
                          onClick={() => {
                            updateDraft({
                              type: "edit",
                              payload: draft.record,
                            });
                          }}
                        >
                          Edit
                        </button>
                        <Prompt
                          btnTxt="Delete"
                          message={`Are you sure you want to delete **${draft.record.name}**?`}
                          options={{ Delete: deleteEntry }}
                          className={styles.delete}
                        />
                      </div>
                    )}
                  </div>
                  <div className={`${styles.body} flex`}>
                    {draft.active ? (
                      <DatabaseDraft />
                    ) : (
                      <Cascade
                        dataObj={prune(draft.record, omittedFields, true)}
                        className={`${styles.fields} flex col`}
                      />
                    )}
                  </div>
                </>
              ) : (
                <span className="fade">No entries</span>
              )}
            </fieldset>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </Page>
  );
}
