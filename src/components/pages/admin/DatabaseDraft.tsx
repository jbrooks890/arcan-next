"use client";
import styles from "@/styles/DBEntryDraft.module.scss";
import axios from "@/interfaces/axios";
import { useState, useEffect } from "react";
// import { useParams, useLocation } from "react-router-dom";
import Dropdown from "@/components/form/Dropdown";
import Form from "@/components/form/Form";
import TextField from "@/components/form/TextField";
import Toggle from "@/components/form/Toggle";
import WordBank from "@/components/form/WordBank";
import ButtonCache from "@/components/form/ButtonCache";
import ChoiceBox from "@/components/form/ChoiceBox";
import FieldSet from "@/components/form/FieldSet";
import DataSetEntry from "@/components/form/DataSetEntry";
import NumField from "@/components/form/NumField";
import ArraySet from "@/components/form/ArraySet";
import FormPreview from "@/components/form/FormPreview";
import DBDraftProvider from "@/components/contexts/DBDraftContext";
import { useDBMaster } from "@/components/contexts/DBContext";
import useForm, { FieldType } from "@/hooks/useForm";

type DBDraftType = {
  record: object;
  schemaName: string;
  updateMaster: Function;
  cancel: Function;
};

export default function DatabaseDraft({
  record,
  schemaName,
  updateMaster,
  cancel,
}: DBDraftType) {
  const [entryMaster, setEntryMaster] = useState();
  const [entryData, setEntryData] = useState();

  const { arcanData } = useDBMaster();
  const { models, references } = arcanData;
  const SCHEMA = models[schemaName];

  const { form, select, field: formField } = useForm();

  // useEffect(() => entryMaster && console.log({ entryMaster }), [entryMaster]);

  const initEntry = () => {
    const { paths } = SCHEMA;
  };

  // :-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:
  // %%%%%%%%%%%%%%%%%%%%%%\ CREATE FIELDS /%%%%%%%%%%%%%%%%%%%%%%
  // :-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:

  function createFields(
    paths,
    ancestors = [],
    source = entryData ?? record,
    updateFn = setEntryData
  ) {
    return Object.entries(paths)
      .filter(
        ([path]) =>
          !["_id", "createdAt", "updatedAt", "__v"].includes(path) &&
          !path.endsWith(".$*")
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

        let label, element;
        let field =
          recordValue?.[path] ??
          defaultValue ??
          options?.default ??
          (required && enumValues ? enumValues[0] : undefined);

        // ---------| CREATE LABEL |---------

        const createLabel = (str = path) => {
          let label = str;
          if (/[a-z]/.test(label.charAt()))
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

        let props: Partial<FieldType> = {
          name: label,
          field: path,
          value,
          required,
        };

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

        const createObjIdBox = ({ ref, refPath }, multi = false) => {
          const reference = refPath
            ? set?.[refPath] || paths[refPath].enumValues[0]
            : ref;
          const dependency = references[reference];

          return select("", dependency, multi);

          return (
            <ChoiceBox
              {...{
                ...props,
                value: multi
                  ? value?.map(entry => entry._id ?? entry)
                  : value?._id ?? value,
              }}
              multi={multi}
              options={Object.keys(dependency)}
              display={dependency}
              handleChange={entry => handleChange(entry)}
            />
          );
        };

        // =====================| SELECT/CHOICES |=====================
        const { suggestions, selfRef, enumRef, pathRef } = options;
        const srcPath = enumRef ? set?.[enumRef] : undefined;

        pathRef && console.log({ pathRef });

        let choices = enumValues?.length
          ? enumValues
          : suggestions?.length
          ? [...suggestions, "other"]
          : enumRef && srcPath;

        // enumRef && console.log({ path, choices });

        if (choices?.length) {
          if (selfRef) {
            choices = choices.filter(choice => {
              return typeof set?.[choice] === "object"
                ? Object.values(set[choice]).join(", ")
                : set?.[choice];
            });
          }

          // srcPath && console.log({ choices });

          const display = Object.fromEntries(
            choices
              .map(choice => {
                const value = set?.[choice];
                return [choice, srcPath && value ? value : createLabel(choice)];
              })
              .sort((a, b) => {
                // console.log({ previous: a[1], current: b[1] });
                return b[1] > a[1];
              })
          );

          // console.log({ display });

          const choiceProps = {
            ...props,
            options: required ? choices : ["", ...choices],
            display,
            handleChange: entry => handleChange(entry),
          };

          // selfRef && console.log({ display: choiceProps.display });

          element = select({ ...choiceProps });
        } else {
          if (instance) {
            switch (instance) {
              case "String":
                props = {
                  ...props,
                  type: "string",
                  options: {
                    block: path === "description",
                  },
                };
                break;
              case "Number":
                props = {
                  ...props,
                  type: "number",
                  options: {
                    min: data.options?.min,
                    max: data.options?.max,
                  },
                };
                break;
              case "Decimal128":
                props = {
                  ...props,
                  type: "number",
                  options: {
                    min: data.options?.min,
                    max: data.options?.max,
                    step: data.options?.step ?? 0.01,
                  },
                };
                break;
              case "Boolean":
                props = { ...props, type: "boolean" };
                break;
              case "Date":
                // console.log("DATE:", set[path] instanceof Date);
                props = {
                  ...props,
                  type: "date",
                  options: {
                    min: data.options?.min,
                    max: data.options?.max,
                  },
                };
                break;
              case "Array":
                const { schema, caster } = data;
                if (caster) {
                  const { instance, options } = caster;
                  if (instance === "String")
                    element = (
                      <WordBank
                        {...props}
                        terms={set?.[path] ?? recordValue?.[path] ?? []}
                        update={entry => handleChange(entry)}
                      />
                    );
                  if (instance === "ObjectID")
                    element = createObjIdBox(caster.options, true);
                }
                if (schema) {
                  const { paths } = schema;

                  element = (
                    <ArraySet
                      {...props}
                      ancestry={[...ancestors, path]}
                      createNewEntry={(source, update) =>
                        createFields(paths, [], source, update)
                      }
                      handleChange={handleChange}
                    />
                  );
                }

                break;
              case "Map":
                const $data = paths[path + ".$*"];
                if ($data?.options?.type?.paths) {
                  element = createDataSetEntry(
                    $data.options.type.paths,
                    options.enum
                  );
                } else {
                  element = NO_ELEMENT;
                  element = (
                    <FieldSet {...props}>
                      <TextField />
                    </FieldSet>
                  );
                }

                break;
              case "ObjectID":
                // console.log({ data });
                element = createObjIdBox(options);
                break;
              case "Mixed":
                if (pathRef) {
                  const pathChain = pathRef?.split(".");
                  console.log({ pathChain, source });
                } else {
                }
                element = <div>MIXED</div>;
                break;
              default:
                console.warn(
                  `${path.toUpperCase()}: No handler for ${instance}`
                );
                element = NO_ELEMENT;
            }

            element = formField(props);
          } else {
            if (options) {
              if (options.type?.paths) {
                const elements = createFields(options.type.paths, [
                  ...ancestors,
                  path,
                ]).map(entry => entry[1].element);
                // console.log({ path, elements });

                element = (
                  <FieldSet {...props} className="col">
                    {elements}
                  </FieldSet>
                );
              } else {
                console.log({ path });
              }
            }
          }
        }

        return element;
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
      cancel();
    }
  };

  // ============================================
  // :::::::::::::::::\ RENDER /:::::::::::::::::
  // ============================================

  return (
    <div id="database-entry" className="flex">
      <Form className="flex col" autoComplete={false}>
        <div className="form-wrapper flex col">
          {buildForm()}
          <ButtonCache>
            <button type="submit" onClick={e => handleSubmit(e)}>
              Save
            </button>
            <button type="reset" onClick={e => handleReset(e)}>
              Reset
            </button>
          </ButtonCache>
        </div>
      </Form>
      {/* {form({validate:true,fields:createFields(SCHEMA.paths),handleSubmit})} */}
      <FormPreview
        form={entryData}
        collection={schemaName}
        buttonText={record ? "Update" : "Submit"}
        legend={record ? "Edit" : "New"}
        handleSubmit={e => handleSubmit(e)}
        cancel={cancel}
      />
    </div>
  );
}
