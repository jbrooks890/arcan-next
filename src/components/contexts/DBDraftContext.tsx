"use client";
import axios from "@/interfaces/axios";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { useDBMaster } from "./DBContext";

const DBDraft = createContext(undefined);
export const useDBDraft = () => useContext(DBDraft);

type DraftAPIState = {
  collectionName: object | undefined;
  record: object | undefined;
  active: boolean;
};

type DraftAPIAction =
  | { type: "switch"; payload: any }
  | {
      type: "select";
      payload: {
        collectionName?: any;
        record: any;
      };
    }
  | { type: "edit"; payload: any }
  | { type: "goHome" | "reset" | "cancel" | "create"; payload: undefined };
// TODO

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// :::::::::::::::::::::::::\ COMPONENT /:::::::::::::::::::::::::
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

export default function DBDraftProvider({ children }: { children: ReactNode }) {
  const { arcanData } = useDBMaster();
  const { models } = arcanData;

  const initialState = {
    collectionName: Object.keys(arcanData?.models)[0], // SELECTION
    record: undefined, // ENTRY SELECTION
    active: false,
  };

  const reducer = (state: DraftAPIState, action: DraftAPIAction) => {
    const { type, payload } = action;
    switch (type) {
      case "switch":
        // SWITCH (COLLECTIONS)
        return {
          ...state,
          collectionName: payload,
          record: undefined,
          active: false,
        };
      case "select":
        // SELECT (RECORD)
        const { collectionName, record } = payload;
        return {
          ...state,
          collectionName: collectionName ?? state.collectionName,
          record,
          active: false,
        };
      case "goHome":
        return {
          ...state,
          record: undefined,
          active: false,
        };
      case "create":
        return {
          ...state,
          record: undefined,
          active: true,
        };
      case "edit":
        return {
          ...state,
          record: payload,
          active: true,
        };
      case "cancel":
        return {
          ...state,
          active: false,
        };
      case "reset":
        return initialState;
      default:
        return state;
    }
  };

  const [draft, dispatch] = useReducer(reducer, initialState);

  // useEffect(() => {
  //   console.log({ draft });
  // }, [draft]);

  // :::::::::::::\ FETCH RECORD /:::::::::::::

  const fetchRecord = async entry_id => {
    try {
      const response = await axios.get(`/${draft.collectionName}/${entry_id}`);
      console.log({ RESPONSE: response.data });
      dispatch({ type: "select", payload: { record: response.data } });
    } catch (err) {
      console.error(err);
    }
  };

  // :::::::::::::\ GET PATH DATA /:::::::::::::

  const getPathData = (ancestors: string[], selection = collectionName) => {
    // Navigate to the appropriate schema path
    const model = models[selection];

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

  // :::::::::::::\ REPLACE IDs /:::::::::::::

  const replaceObjIDs = (data: object, pathChain = []) => {
    return Object.fromEntries(
      Object.entries(data).map(entry => {
        const [field, value] = entry;
        const ancestry = [...pathChain, field];
        const pathData = getPathData(ancestry);
        const { instance } = pathData;
        // console.log({ field, pathData });
        // instance && console.log({ field, instance });

        let result = entry;

        if (instance && instance === "ObjectID") {
          const { ref, refPath } = pathData.options;
          console.log({ field, value, pathData });
          result = [field, `${value} (${references[ref]?.[value] ?? "Test"})`];
        }

        return typeof value === "object"
          ? [field, replaceObjIDs(value, pathChain)]
          : result;
      })
    );
  };

  // :::::::::::::\ SUMMARIZE /:::::::::::::

  // ============================================
  // :::::::::::::::::\ RENDER /:::::::::::::::::
  // ============================================

  return (
    <DBDraft.Provider value={{ draft, updateDraft: dispatch, fetchRecord }}>
      {children}
    </DBDraft.Provider>
  );
}
