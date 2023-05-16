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
import Table from "@/components/form/Table";

type Props = {
  params: {
    collection: string;
  };
};

export default function Database({ params }: Props) {
  const { arcanData, omittedFields } = useDBMaster();
  const { collections, models, references } = arcanData;
  const { draft, updateDraft, fetchRecord } = useDBDraft();
  const { table } = useTableElement();
  const { collection } = params;
  const records = collections[collection];
  // const headers = records.map(record => Object.keys(record));
  const headers = Array.from(
    new Set(
      records.reduce((prev, curr) => {
        return [...prev, ...Object.keys(curr)];
      }, [])
    )
  ).filter(header => !omittedFields.includes(header));

  console.log({ records, headers });
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

  return <Table data={records} primary="name" headers={headers as string[]} />;
  return <h1>Test</h1>;
}
