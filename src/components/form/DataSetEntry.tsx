import { useEffect, useRef, useState } from "react";
import DataSetItem from "./DataSetItem";
import InputWrapper from "./InputWrapper";
import useForm, { FieldType } from "@/hooks/useForm";

type Props = {
  options: { [key: string]: FieldType[] };
  multi?: boolean;
} & InputPropsType;

export default function DataSetEntry({
  field,
  options,
  multi = false,
  handleChange,
  value,
  wrapper,
}: // subFields,
Props) {
  const { renderEach } = useForm();
  // const inputs = useRef([]);
  const primaries = useRef<(HTMLInputElement | null)[]>([]);

  console.log({ field, value, options });

  // --------------| UPDATE |--------------

  const update = (option: keyof Props["options"], subFields) => {
    // console.log("\nTEST:", value);

    handleChange(
      Object.keys(value).includes(option as string)
        ? Object.fromEntries(
            Object.entries(value).filter(([option]) =>
              primaries.current
                .filter(option => option.checked)
                .map(input => input.value)
                .includes(option)
            )
          )
        : { ...value, [option]: subFields }
    );
  };

  // --------------| ADD ENTRY |--------------

  const addEntry = entry => !value[entry] && update(entry);

  // --------------| REMOVE ENTRY |--------------

  const removeEntry = entry =>
    Object.fromEntries(
      Object.entries(value).filter(([option]) =>
        primaries.current
          .filter(option => option.checked)
          .map(input => input.value)
          .includes(entry)
      )
    );

  const OUTPUT =
    value && Object.keys(options).length ? (
      <ul className="entry-cache flex col">
        {Object.entries(options).map(([option, secondaries], i) => {
          // const DATA = createFields(option);
          // const ELEMENTS = DATA.map(entry => entry[1].element);
          // const FIELDS = Object.fromEntries(
          //   DATA.map(([path, entry]) => [path, entry.field])
          // );

          // console.log({ FIELDS });
          return (
            <DataSetItem
              key={i}
              setRef={(element: HTMLInputElement) =>
                (primaries.current[i] = element)
              }
              option={option}
              secondaries={secondaries}
              field={field}
              multi={multi}
              checked={Object.keys(value).includes(option)}
              // handleChange={() => update(option, FIELDS)}
            />
          );
        })}
      </ul>
    ) : (
      <span className="fade">No entries</span>
    );

  return wrapper ? <InputWrapper {...wrapper}>{OUTPUT}</InputWrapper> : OUTPUT;
}
