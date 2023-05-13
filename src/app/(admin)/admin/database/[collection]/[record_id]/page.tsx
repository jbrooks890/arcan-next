"use client";
import styles from "@/styles/DBEntryDraft.module.scss";
import axios from "@/interfaces/axios";
import { useState, useEffect, MouseEventHandler, ReactNode } from "react";
import WordBank from "@/components/form/WordBank";
import DataSetEntry from "@/components/form/DataSetEntry";
import ArraySet from "@/components/form/ArraySet";
import { useDBMaster } from "@/components/contexts/DBContext";
import useForm, { FieldType } from "@/hooks/useForm";
import Mixed from "@/components/form/database/Mixed";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Input from "@/components/form/Input";
import { useDBDraft } from "@/components/contexts/DBDraftContext";

type Props = {
  params: {
    collection: string;
    record_id: string;
  };
  // chilren: ReactNode;
};

export default function Draft({ params }: Props) {
  const { arcanData, omittedFields } = useDBMaster();
  const { models, references, collections } = arcanData;
  const { draft, updateDraft } = useDBDraft();
  // -----------------------------------------------------------------------
  const { collection, record_id } = params;
  const isNew = record_id === "new";
  const record = isNew
    ? undefined
    : collections[collection].find(record => record._id === record_id);
  // useEffect(() => {
  //   isNew && updateDraft({ type: "create" }), [isNew];
  // });
  // -----------------------------------------------------------------------
  const SCHEMA = models[collection];

  const {
    form,
    text,
    number,
    float,
    boolean,
    date,
    select,
    group,
    component,
    state,
    process,
  } = useForm();

  // useEffect(() => entryMaster && console.log({ entryMaster }), [entryMaster]);

  const handleCancel: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    updateDraft({ type: "cancel" });
  };

  // :-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:
  // %%%%%%%%%%%%%%%%%%%%%%\ CREATE FIELDS /%%%%%%%%%%%%%%%%%%%%%%
  // :-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:

  function createFields(
    paths: object,
    ancestors: string[] = [],
    source = state() ?? record
    // updateFn = setEntryData
  ): FieldType[] {
    return Object.entries(paths)
      .filter(
        ([path]) => !omittedFields.includes(path) && !path.endsWith(".$*")
      )
      .map(([path, data], key) => {
        const {
          instance,
          options,
          isRequired: required,
          defaultValue,
          enumValues,
        } = data;

        const getNestedValue = (root = source, arr = ancestors) =>
          root ? arr.reduce((obj, path) => obj?.[path], root) : null;

        const recordValue = record ? getNestedValue(record) : null;

        let label: string, element: FieldType;

        let field =
          recordValue?.[path] ??
          defaultValue ??
          options?.default ??
          (required && enumValues ? enumValues[0] : undefined);

        const set = getNestedValue();
        const value = set?.[path] ?? field;

        // console.log({ path, value });

        let props: Partial<FieldType> = {
          value,
          required,
        };

        // const NO_ELEMENT = text(label + "NoElement");

        // ---------| CREATE OBJECT ID BOX |---------

        type ObjIDType = {
          ref?: string; // SCHEMA NAME
          refPath?: keyof typeof paths; // KEYOF CURRENT SCHEMA
        };

        const createObjIdBox = (
          { ref, refPath }: ObjIDType,
          multi = false
        ): FieldType => {
          let _reference = ref ?? refPath ?? undefined;
          let nestedRef = _reference?.includes(".")
            ? _reference.split(".")
            : undefined;
          const reference = refPath
            ? set?.[refPath] || paths[refPath]?.enumValues[0]
            : ref;

          // nestedRef && console.log({ nestedRef, test: nestedRef.slice(0, -1) });
          let last = nestedRef ? nestedRef.pop() : undefined;
          nestedRef &&
            last &&
            console.log({
              nestedRef,
              last,
              test: getNestedValue(undefined, [...ancestors, ...nestedRef])?.[
                last
              ],
            });
          // const refValue = nestedRef
          //   ? getNestedValue(source, [...ancestors, ...nestedRef.slice(0, -1)])[
          //       nestedRef.pop()
          //     ]
          //   : refPath
          //   ? set?.[refPath]
          //   : ref;

          // console.log({ refValue });
          const dependency = references[reference];

          // console.log({ path, refPath, reference });
          refPath &&
            path !== "source" &&
            // console.log({ path, refPath, set, paths });
            console.log({ path, source });

          return select("$" + path, dependency, multi, false, {
            ...props,
          });
        };

        // =====================| SELECT/CHOICES |=====================
        const { suggestions, selfRef, enumRef, pathRef } = options;
        const srcPath = enumRef ? set?.[enumRef] : undefined;

        // pathRef && console.log({ pathRef });

        let choices = enumValues?.length
          ? enumValues
          : suggestions?.length
          ? suggestions
          : srcPath;

        // enumRef && console.log({ path, choices });

        if (choices?.length) {
          if (selfRef) {
            choices = choices.filter(choice => {
              return typeof set?.[choice] === "object"
                ? Object.values(set[choice]).join(", ")
                : set?.[choice];
            });
          }

          element = select("$" + path, choices, false, !!suggestions, {
            ...props,
          });
        } else {
          // --------------------------------------------
          // %%%%%%%%%%%%%%| SIMPLE TYPES |%%%%%%%%%%%%%%
          // --------------------------------------------
          const label = "$" + path;
          if (instance) {
            switch (instance) {
              case "String":
                element = text(label, path === "description", { ...props });
                break;
              case "Number":
                element = number(
                  label,
                  false,
                  {
                    min: data.options?.min,
                    max: data.options?.max,
                  },
                  { ...props }
                );
                break;
              case "Decimal128":
                element = float(
                  label,
                  data.options?.step ?? 0.01,
                  {
                    min: data.options?.min,
                    max: data.options?.max,
                  },
                  { ...props }
                );
                break;
              case "Boolean":
                element = boolean(label, false, { ...props });
                break;
              case "Date":
                // console.log("DATE:", set[path] instanceof Date);
                element = date(
                  label,
                  {
                    options: { min: data.options?.min, max: data.options?.max },
                  },
                  { ...props }
                );
                break;
              case "ObjectID":
                // console.log({ data });
                element = createObjIdBox(options);
                break;
              // --------------| ↓---------------↓ |--------------
              // %%%%%%%%%%%%%%| ↓ COMPLEX TYPES ↓ |%%%%%%%%%%%%%%
              // --------------| ↓---------------↓ |--------------
              case "Array":
                const { schema, caster } = data;
                // >>>>>>> ARRAY OF SIMPLE TYPES <<<<<<<<
                if (caster) {
                  const { instance } = caster;
                  if (instance === "String") {
                    // console.log({ path, value });
                    element = component(<WordBank />, label, {
                      ...props,
                    });
                  }

                  if (instance === "ObjectID")
                    element = createObjIdBox(caster.options, true);
                }
                // >>>>>>> ARRAY OF SUBDOCS <<<<<<<<
                if (schema) {
                  const { paths } = schema;
                  const entryFields = createFields(paths);

                  // console.log({ path, props });

                  element = component(
                    <ArraySet entryFields={entryFields} value={value} />,
                    label,
                    {
                      ...props,
                      children: createFields(paths),
                    }
                  );
                }

                break;
              case "Map":
                const $data = paths[path + ".$*"];
                if ($data?.options?.type?.paths) {
                  const fields = Object.fromEntries(
                    options.enum.map(option => {
                      const ancestry = [...ancestors, path, option];
                      return [
                        option,
                        process(
                          createFields($data.options.type.paths, ancestry),
                          ancestry
                        ),
                      ];
                    })
                  );

                  element = component(
                    <DataSetEntry
                      multi={true}
                      options={fields}
                      ancestors={[...ancestors, path]}
                    />,
                    `$${path}`,
                    { ...props }
                  );
                } else {
                  break;
                }

                break;
              case "Mixed":
                if (pathRef) {
                  const pathChain = pathRef?.split(".");
                  // console.log({ pathChain, source });
                }
                element = component(<Mixed value={value} />, label, undefined);
                break;
              // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
              // -----------------| DEFAULT |-----------------
              // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
              default:
                element = text(label + "NoElement");
            }

            // element = formField(props);
          } else {
            if (options) {
              if (options.type?.paths) {
                const elements = createFields(options.type.paths, [
                  ...ancestors,
                  path,
                ]);
                // console.log({ path, elements });

                element = group(label, elements);
              } else {
                console.log({ path });
              }
            }
          }
        }

        return element ?? text(label + "NoElement");
      });
  }

  // :::::::::::::\ SEND UPDATE /:::::::::::::
  const sendUpdate = async () => {
    try {
      const response = await axios.put(
        `/${draft.collectionName}/${record._id}`,
        entryData
      );
      return response?.data;
    } catch (err) {
      console.error(err.message);
      console.error(err.response.data.error);
      return;
    }
  };

  // :::::::::::::\ SEND NEW /:::::::::::::
  const sendNew = async () => {
    try {
      const response = await axios.post("/" + draft.collection, entryData);
      !record && initEntry(draft.collectionName);
      // response?.data && updateArcanData(response.data);
      return response?.data;
    } catch (err) {
      console.error(err.message);
      console.error(err.response.data.error.split(", ").join("\n"));
      return;
    }
  };

  // :::::::::::::\ HANDLE SUBMIT /:::::::::::::
  const handleSubmit: MouseEventHandler<HTMLButtonElement> = async () => {
    // console.clear();
    const success = record ? await sendUpdate() : await sendNew();
    if (success) {
      console.log({ success });
      // updateMaster(success);
      // cancel(e);
    }
  };

  // ============================================
  // :::::::::::::::::\ RENDER /:::::::::::::::::
  // ============================================

  return form({
    name: record ? "Edit" : "New",
    submitTxt: record ? "Update" : "Submit",
    fields: createFields(SCHEMA.paths),
    validate: true,
    useSummary: { omit: omittedFields },
    handleSubmit,
    handleCancel,
    className: styles.record,
  });
}
