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
  const {
    arcanData: { models, references },
    omittedFields,
  } = useDBMaster();
  // const { models, references } = arcanData;

  const initialState = {
    collectionName: Object.keys(models)[0], // SELECTION
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

  useEffect(() => {
    console.log({ selection: draft.collectionName });
  }, [draft.collectionName]);

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

  const getPathData = (
    ancestors: string[],
    selection = draft.collectionName
  ) => {
    // Navigate to the appropriate schema path
    const model = models[selection];
    // console.log({ ancestors, model });

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

  const replaceObjIDs = (
    data: object,
    pathChain = [],
    selection = draft.collectionName
  ) => {
    return Object.fromEntries(
      Object.entries(data)
        .filter(([field]) => !omittedFields.includes(field))
        .map(entry => {
          const [field, value] = entry;
          const ancestry = [...pathChain, field],
            { options, instance } = getPathData(ancestry, selection);
          const isArray = Array.isArray(value);

          let result = entry;

          if (instance === "ObjectID") {
            isArray && console.log(`${field} = array`);

            const { ref, refPath } = options,
              model = models[selection],
              reference = ref ?? model[refPath];
            result = [field, references[reference]?.[value]];
          }

          if (typeof value === "object") {
            const child = replaceObjIDs(
              value,
              [...pathChain, field],
              selection
            );

            result = [field, isArray ? Object.values(child) : child];
          }

          return result;

          // return typeof value === "object"
          //   ? [field, replaceObjIDs(value, [...pathChain, field], selection)]
          //   : result;
        })
    );
  };

  // :::::::::::::\ SUMMARIZE /:::::::::::::

  const summarize = (data: object) => {};

  // ============================================
  // :::::::::::::::::\ RENDER /:::::::::::::::::
  // ============================================

  return (
    <DBDraft.Provider
      value={{ draft, updateDraft: dispatch, fetchRecord, replaceObjIDs }}
    >
      {children}
    </DBDraft.Provider>
  );
}
