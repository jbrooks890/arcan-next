"use client";
import styles from "@/styles/DBEntryDraft.module.scss";
import axios from "@/interfaces/axios";
import { useState, useEffect, MouseEventHandler } from "react";
import WordBank from "@/components/form/WordBank";
import DataSetEntry from "@/components/form/DataSetEntry";
import ArraySet from "@/components/form/ArraySet";
import { useDBMaster } from "@/components/contexts/DBContext";
import useForm, { FieldType } from "@/hooks/useForm";
import Mixed from "@/components/form/database/Mixed";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

type DBDraftType = {
  record: object;
  schemaName: string;
  updateMaster: Function;
  cancel: MouseEventHandler<HTMLButtonElement>;
};

export default function DatabaseDraft({
  record,
  schemaName,
  updateMaster,
  cancel,
}: DBDraftType) {
  const [entryMaster, setEntryMaster] = useState();
  const [entryData, setEntryData] = useState();

  const { arcanData, omittedFields } = useDBMaster();
  const { models, references } = arcanData;
  const SCHEMA = models[schemaName];

  const router = useRouter();
  const pathname = usePathname();
  const CURRENT = pathname.split("/").pop();

  // console.log("TEST", { CURRENT });

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
    field: formField,
  } = useForm();

  // useEffect(() => entryMaster && console.log({ entryMaster }), [entryMaster]);

  const initEntry = () => {
    const { paths } = SCHEMA;
  };

  // :-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:
  // %%%%%%%%%%%%%%%%%%%%%%\ CREATE FIELDS /%%%%%%%%%%%%%%%%%%%%%%
  // :-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:

  function createFields(
    paths: object,
    ancestors: string[] = [],
    source = entryData ?? record,
    updateFn = setEntryData
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

        const getNestedValue = root =>
          root ? ancestors.reduce((obj, path) => obj?.[path], root) : null;

        const recordValue = record ? getNestedValue(record) : null;

        let label: string, element: FieldType;

        let field =
          recordValue?.[path] ??
          defaultValue ??
          options?.default ??
          (required && enumValues ? enumValues[0] : undefined);

        // ---------| CREATE LABEL |---------

        const createLabel = (str = path) => {
          let label = str;
          if (/[a-z]/.test(label.charAt(0)))
            label = label.replace(/([A-Z])/g, " $1").toLowerCase();

          if (label.startsWith("_")) label = label.slice(1);

          const shorthands = new Map([
            ["pref", "preference"],
            ["ref", "reference"],
            ["attr", "attribute"],
            ["org", "organization"],
            ["diffr", "differential"],
            ["intro", "introduction"],
            ["avg", "average"],
            ["dob", "date of birth"],
            ["abbr", "abbreviation"],
            ["msg", "message"],
          ]);
          const nonPlurals = ["s", "y"];

          shorthands.forEach((long, short) => {
            const regex = new RegExp(`\\b${short}\\b`);
            if (label.match(regex)) label = label.replace(regex, long);
          });
          if (parent && label.includes(parent))
            label = label.replace(parent, "").trim();
          if (
            (instance === "Array" || instance === "Map") &&
            !nonPlurals.includes(label.charAt(label.length - 1))
          )
            label += "(s)";
          if (label.startsWith("is ")) label = label.slice(2) + "?";
          return label;
        };

        label = createLabel();

        const set = getNestedValue(source);
        const value = set?.[path] ?? field;

        // console.log({ path, value });

        let props: Partial<FieldType> = {
          value,
          required,
        };

        const NO_ELEMENT = text(label + "NoElement");

        // ---------| CREATE DATASET ENTRY |---------

        const createDataSetEntry = (paths, options, multi = true) => {
          return (
            <DataSetEntry
              {...props}
              multi={multi}
              options={options}
              createFields={option =>
                createFields(paths, [...ancestors, path, option])
              }
              handleChange={handleChange}
            />
          );
        };

        // ---------| CREATE OBJECT ID BOX |---------

        type ObjIDType = {
          ref?: string; // SCHEMA NAME
          refPath?: keyof typeof paths; // KEYOF CURRENT SCHEMA
        };

        const createObjIdBox = (
          { ref, refPath }: ObjIDType,
          multi = false
        ): FieldType => {
          const reference = refPath
            ? set?.[refPath] || paths[refPath].enumValues[0]
            : ref;
          const dependency = references[reference];

          // console.log({ path, dependency });

          return select("$" + path, dependency, multi, false, { ...props });
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
          if (instance) {
            const label = "$" + path;
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
                    element = component(
                      label,
                      [WordBank, { value }],
                      "string",
                      {
                        ...props,
                      }
                    );
                  }

                  if (instance === "ObjectID")
                    element = createObjIdBox(caster.options, true);
                }
                // >>>>>>> ARRAY OF SUBDOCS <<<<<<<<
                if (schema) {
                  const { paths } = schema;
                  const entryFields = createFields(paths);

                  // console.log({ newEntry });
                  // console.log({ path, ...props });

                  element = component(
                    label,
                    [ArraySet, { entryFields, value }],
                    undefined,
                    { ...props, children: createFields(paths) }
                  );
                }

                break;
              // case "Map":
              //   const $data = paths[path + ".$*"];
              //   if ($data?.options?.type?.paths) {
              //     element = createDataSetEntry(
              //       $data.options.type.paths,
              //       options.enum
              //     );
              //   } else {
              //     // element = NO_ELEMENT;
              //     element = (
              //       <FieldSet {...props}>
              //         <TextField />
              //       </FieldSet>
              //     );
              //   }

              //   break;
              // case "Mixed":
              //   if (pathRef) {
              //     const pathChain = pathRef?.split(".");
              //     // console.log({ pathChain, source });
              //   }
              //   // props = { ...props, type: "set", options: { Element: Mixed } };
              //   element = component(label, [Mixed]);
              //   break;
              // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
              // -----------------| DEFAULT |-----------------
              // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
              default:
                // console.warn(
                //   `${path.toUpperCase()}: No handler for ${instance}`
                // );
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

  // %%%%%%%%%%%%%\ BUILD FORM /%%%%%%%%%%%%%

  const buildForm = () => {
    const { paths } = SCHEMA;
    const DATA = createFields(paths);
    // console.log({ DATA });

    if (!entryMaster) {
      setEntryMaster(Object.fromEntries(DATA));
      setEntryData(
        Object.fromEntries(
          DATA.map(([path, pathData]) => [path, pathData.field])
        )
      );
    }

    // console.log(createFields(paths));
    return DATA.map(entry => entry[1].element);
  };

  // :::::::::::::\ HANDLE RESET /:::::::::::::
  const handleReset = e => {
    e.preventDefault();
    console.clear();
    console.log(`%cFORM`, "color: lime");
    console.log(`New ${schemaName}:`, entryData);
    console.log("%cJSON:", "color:cyan", JSON.stringify(entryData));
  };

  // :::::::::::::\ SEND UPDATE /:::::::::::::
  const sendUpdate = async () => {
    try {
      const response = await axios.put(
        `/${schemaName}/${record._id}`,
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
      const response = await axios.post("/" + schemaName, entryData);
      !record && initEntry(schemaName);
      // response?.data && updateArcanData(response.data);
      return response?.data;
    } catch (err) {
      console.error(err.message);
      console.error(err.response.data.error.split(", ").join("\n"));
      return;
    }
  };

  // :::::::::::::\ HANDLE SUBMIT /:::::::::::::
  const handleSubmit = async e => {
    e.preventDefault();
    // console.clear();
    const success = record ? await sendUpdate() : await sendNew();
    if (success) {
      console.log({ success });
      updateMaster(success);
      cancel(e);
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
    summary: {},
    handleSubmit,
    handleCancel: cancel,
    className: styles.record,
  });
}
