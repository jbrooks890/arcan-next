"use client";
import styles from "@/styles/DatabaseView.module.scss";
import { prune } from "@/lib/utility";
import { ReactNode } from "react";
import { useDBMaster } from "@/components/contexts/DBContext";
import { useDBDraft } from "@/components/contexts/DBDraftContext";
import Cascade from "@/components/form/Cascade";
import Prompt from "@/components/frags/Prompt";

type Props = {
  params: { record_id: string; collection: string };
  children: ReactNode;
};

export default function Draft_Layout({ params, children }: Props) {
  const { collection, record_id } = params;
  // -----------------------------------------------------------------------
  const { arcanData, omittedFields } = useDBMaster();
  const { collections, references } = arcanData;
  // -----------------------------------------------------------------------
  const { draft, updateDraft, replaceObjIDs } = useDBDraft();
  const record = collections[collection].find(
    record => record._id === record_id
  );
  // -----------------------------------------------------------------------

  return draft.active || record ? (
    <>
      <div className={`${styles["entry-header"]} grid`}>
        {/* <div className={styles["entry-title"]}></div> */}
        <h3
          className={styles["entry-name"]}
          data-entry-id={record_id ?? undefined}
        >
          {references[collection][record_id] ?? `New ${collection}`}
        </h3>
        {record_id && <h5 className={styles["entry-id"]}>{record_id}</h5>}
        {!draft.active && (
          <div className={`${styles["button-cache"]} flex align-end`}>
            <button
              className={styles.edit}
              onClick={() => {
                updateDraft({
                  type: "edit",
                  payload: record,
                });
              }}
            >
              Edit
            </button>
            <Prompt
              btnTxt="Delete"
              message={`Are you sure you want to delete **${record.name}**?`}
              options={{ Delete: () => {} }}
              className={styles.delete}
            />
          </div>
        )}
      </div>
      <div className={`${styles.body} flex`}>
        {draft.active ? (
          children
        ) : (
          <Cascade
            // source={prune(record, omittedFields, true)}
            source={replaceObjIDs(record)}
            className={`${styles.fields} flex col`}
          />
        )}
      </div>
    </>
  ) : (
    <span className="fade">No entries</span>
  );
}
