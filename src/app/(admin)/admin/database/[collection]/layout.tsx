"use client";
import styles from "@/styles/DatabaseView.module.scss";
import axios from "@/interfaces/axios";
import Dropdown from "@/components/form/Dropdown";
import Menu from "@/components/form/Menu";
import { useDBMaster } from "@/components/contexts/DBContext";
import useTableElement from "@/hooks/useTableElement";
import Page from "@/components/layout/Page";
import { useDBDraft } from "@/components/contexts/DBDraftContext";
import { ReactNode } from "react";
import {
  useRouter,
  usePathname,
  useSelectedLayoutSegment,
} from "next/navigation";

type Props = {
  params: {
    collection: string;
  };
  children: ReactNode;
};

export default function Database_Layout({ params, children }: Props) {
  const { arcanData, omittedFields } = useDBMaster();
  const { models, references, collections } = arcanData;
  const { draft, updateDraft, fetchRecord } = useDBDraft();
  const { table } = useTableElement();
  const router = useRouter();
  // -----------------------------------------------------------------------
  const { collection } = params;
  const record_id = useSelectedLayoutSegment();
  const record = collections[collection].find(
    record => record._id === record_id
  );
  // -----------------------------------------------------------------------
  const ROOT_URL = "/admin/database/";
  const HOME_URL = `${ROOT_URL}/${collection}/`;
  // console.log({ arcanData });
  // console.log({ collections, collection, record_id, record });

  // // :::::::::::::\ DELETE ENTRY /:::::::::::::
  const deleteEntry = async (id = record_id, collection = draft.collection) => {
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
        {collection ? (
          <div className={`${styles.home} grid`}>
            {/* ------- COLLECTION SELECTOR ------- */}
            <fieldset className={`${styles.selector} flex middle`}>
              <legend>Collection</legend>
              <Dropdown
                options={Object.keys(models)}
                value={collection}
                handleChange={collectionName => {
                  router.push(`${ROOT_URL}/${collectionName}`);
                  updateDraft({ type: "switch", payload: collectionName });
                }}
                className={styles.dropdown}
              />
            </fieldset>

            {/* ------- COLLECTION DATA ------- */}
            <fieldset className={`${styles["collection-data"]} flex middle`}>
              <legend>Collection Data</legend>
              <div className={`${styles.cache} flex middle`}>
                <div>Entries: {Object.keys(references[collection]).length}</div>
                <button
                  onClick={() => {
                    record && updateDraft({ type: "goHome" });
                    router.push(HOME_URL);
                  }}
                >
                  Home
                </button>
                <button>Filter</button>
              </div>
              <button
                className={`${styles.create} flex middle`}
                onClick={() => {
                  updateDraft({ type: "create" });
                  router.push(HOME_URL + "new");
                }}
              >
                New
              </button>
            </fieldset>

            {/* ------- ENTRY MENU ------- */}
            <Menu
              label="Entries"
              options={
                collection === "User"
                  ? Object.values(references[collection])
                  : Object.keys(references[collection])
              }
              className="col"
              display={
                collection === "User" ? undefined : references[collection]
              }
              handleChange={entry_id => {
                // updateDraft({ type: "switch", payload: entry_id }); //TODO
                router.push(`${HOME_URL + entry_id}`);
              }}
              value={record_id}
              id="collection-entry-list"
            />

            {/* ------- ENTRY DATA ------- */}
            <fieldset className={`${styles.viewport} flex col`}>
              <legend>{`Entry ${record_id ? "Data" : "List"}`}</legend>
              {children}
            </fieldset>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </Page>
  );
}
