import { ReactElement, useEffect, useRef, useState } from "react";
import DataSetItem from "./DataSetItem";
import InputWrapper from "./InputWrapper";
import useForm, { FieldType, FieldsDataType } from "@/hooks/useForm";

type Props = {
  options: { [key: string]: FieldsDataType };
  ancestors?: string[];
  multi?: boolean;
} & InputPropsType;

export default function DataSetEntry({
  field,
  options,
  ancestors,
  multi = false,
  handleChange,
  value,
  wrapper,
}: Props) {
  const primaries = useRef<(HTMLInputElement | null)[]>([]);

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
        {Object.entries(options).map(([option, subField], i) => {
          const { elements, initialOutput } = subField;
          const secondaries = Object.values(elements);
          return (
            <DataSetItem
              key={i}
              setRef={(element: HTMLInputElement) =>
                (primaries.current[i] = element)
              }
              option={option}
              secondaries={secondaries}
              field={
                ancestors?.length ? [...ancestors, option].join("-") : option
              }
              multi={multi}
              checked={Object.keys(value).includes(option)}
              handleChange={() => update(option, initialOutput)}
            />
          );
        })}
      </ul>
    ) : (
      <span className="fade">No entries</span>
    );

  return wrapper ? (
    <InputWrapper {...wrapper} group={true}>
      {OUTPUT}
    </InputWrapper>
  ) : (
    OUTPUT
  );
}
