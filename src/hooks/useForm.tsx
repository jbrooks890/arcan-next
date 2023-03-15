import { makeHTMLSafe } from "@/lib/utility";
import Form from "@/components/form/Form";
import { FormEventHandler, MouseEventHandler } from "react";

export default function useForm() {
  type FieldTypeEnum =
    | "string"
    | "block"
    | "number"
    | "boolean"
    | "date"
    | "select"
    | "multi";

  type FieldType = {
    name: string;
    type: FieldTypeEnum;
    value?: any;
    required?: boolean;
    label?: string;
    choices?: (string | object)[];
  };

  const field = (
    name: string,
    type?: "string" | "block" | "number" | "boolean" | "date",
    value?: any,
    required = false,
    label = makeHTMLSafe(name)
  ): FieldType => ({
    name,
    type: type ?? "string",
    value,
    required,
    label,
  });

  // type ChainType = {
  //   [key: string]:
  // }

  const choice = (
    name: string,
    choices: (string | object)[],
    multi = false,
    value?: any,
    required = false,
    label = makeHTMLSafe(name)
  ): FieldType => {
    return {
      name,
      type: multi ? "multi" : "select",
      value,
      required,
      label,
      choices,
    };
  };

  type FormType = {
    name: string;
    fields: FieldType[];
    handleSubmit: FormEventHandler<HTMLFormElement>;
    submitTxt?: string;
    resetTxt?: string;
    handleReset?: MouseEventHandler<HTMLButtonElement>;
  };

  const form = ({
    name,
    fields,
    handleSubmit,
    submitTxt,
    resetTxt,
    handleReset,
  }: FormType) => {
    return (
      <Form name={name} handleSubmit={handleSubmit}>
        <h2>{name}</h2>
        <button type="submit">{submitTxt ?? "Submit"}</button>
        <button type="reset" onClick={handleReset}>
          {resetTxt ?? "Reset"}
        </button>
      </Form>
    );
  };

  return { field, choice, form };
}
