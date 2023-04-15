"use client";
import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactElement,
  useReducer,
} from "react";
// import axios from "@/interfaces/axios";

export type ArcanDataType = {
  collections: object;
  models: object;
  references: object;
};

const DBContext = createContext();
export const useDBMaster = () => useContext(DBContext);

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// :::::::::::::::::::::::::\ COMPONENT /:::::::::::::::::::::::::
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

type reducerActionType = {
  type: "add" | "update" | "delete";
  payload?: any;
};

export default function DBContextProvider({
  data,
  children,
}: {
  data: ArcanDataType;
  children: ReactElement | ReactElement[];
}) {
  const reducer = (state, action: reducerActionType) => {
    switch (action.type) {
      case "update":
        break; // BREAK should be RETURN
      default:
        return state;
    }
  };
  // const [arcanData, setArcanData] = useState<ArcanDataType | null>(null);
  const [state, dispatch] = useReducer(reducer, prepData());
  const omittedFields = ["_id", "id", "createdAt", "updatedAt", "__v"];

  // console.log({ data });

  // :::::::::::::\ PREPARE DATA /:::::::::::::

  function prepData() {
    let [models, references, collections] = Object.entries(data)
      .map(([name, { schema, collection }]) => {
        return [
          [name, schema],
          [
            name,
            Object.fromEntries(collection.map(({ _id, name }) => [_id, name])),
          ],
          [name, collection],
        ];
      })
      .reduce(
        (
          [$schemata, $references, $collections],
          [schema, reference, collection]
        ) => {
          // console.log({ reference });
          return [
            [...$schemata, schema],
            [...$references, reference],
            [...$collections, collection],
          ];
        },
        [[], [], []]
      );

    models = Object.fromEntries(models);
    references = Object.fromEntries(references);
    collections = Object.fromEntries(collections);

    return { models, references, collections };
  }

  // :::::::::::::\ FETCH ENTRY /:::::::::::::

  // async function fetchEntry(selection, entry_id) {
  //   try {
  //     const response = await axios.get(`/${selection}/${entry_id}`);
  //     console.log({ RESPONSE: response.data });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  // // :::::::::::::\ UPDATE ARCAN DATA /:::::::::::::

  // const updateArcanData = (newData, collection) => {
  //   setArcanData(prev => {
  //     const { _id, name, subtitle, title, username } = newData;

  //     const NAME =
  //       (typeof name === "object" ? name[Object.keys(name)[0]] : name) ??
  //       subtitle ??
  //       title ??
  //       username ??
  //       `${collection}: ${_id}`;

  //     return {
  //       ...prev,
  //       references: {
  //         ...prev.references,
  //         [collection]: { ...prev.references[collection], [_id]: NAME },
  //       },
  //     };
  //   });
  // };

  // ============================================
  // :::::::::::::::::\ RENDER /:::::::::::::::::
  // ============================================

  return (
    <DBContext.Provider
      value={{
        arcanData: state,
        updateArcanData: dispatch,
        // setArcanData,
        omittedFields,
        // fetchModels,
        // fetchEntry,
      }}
    >
      {/* {arcanData ? children : "Loading..."} */}
      {children}
    </DBContext.Provider>
  );
}
