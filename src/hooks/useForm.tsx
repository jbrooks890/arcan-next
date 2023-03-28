import { makeHTMLSafe } from "@/lib/utility";
import Form from "@/components/form/Form";
import { MouseEvent, MouseEventHandler, useState } from "react";
import Label from "@/components/form/Label";
import TextField from "@/components/form/TextField";
import NumField from "@/components/form/NumField";
import Toggle from "@/components/form/Toggle";
import Password from "@/components/form/Password";
import DateField from "@/components/form/DateField";
import EmailField from "@/components/form/EmailField";

export type FieldTypeEnum =
  | "string"
  // | "block"
  | "number"
  | "float"
  | "boolean"
  | "date"
  | "email"
  | "password"
  | "set"
  | "select";
// | "multi";

type validatorFn = (v: any) => boolean | Promise<boolean>; //TODO: function that returns bool

export type FieldType = {
  name: string;
  field: string;
  type: FieldTypeEnum;
  value?: any;
  placeholder?: string;
  required?: boolean;
  confirm?: boolean;
  choices?: (string | object)[];
  subFields?: FieldType[];
  validation?:
    | validatorFn
    | { validator: validatorFn; criteria: string; error?: string }[];
  labelize?: boolean;
  options?: {
    block?: boolean;
    min?: number;
    max?: number;
    multi?: boolean;
  };
};

export type FormDataType = {
  [key: string]: any;
};

export type FormType = {
  name: string;
  fields: FieldType[];
  validate?: boolean;
  handleSubmit: (v?: any) => void;
  submitTxt?: string;
  resetTxt?: string;
  handleReset?: MouseEventHandler<HTMLButtonElement>;
  postMessage?: (v: FormDataType) => string;
};

// =================================================
// %%%%%%%%%%%%%%%%%%\ COMPONENT /%%%%%%%%%%%%%%%%%%
// =================================================

export default function useForm() {
  const [formData, setFormData] = useState<FormDataType>();
  const [submitted, setSubmitted] = useState(false);

  // <><><><><><><><>\ LABELIZE /<><><><><><><><>

  const labelize = (str: string, isArray = false) => {
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
    // if (parent && label.includes(parent))
    //   label = label.replace(parent, "").trim();
    if (isArray && !nonPlurals.includes(label.charAt(label.length - 1)))
      label += "(s)";
    if (label.startsWith("is ")) label = label.slice(2) + "?";
    return label;
  };

  // <><><><><><><><>\ FIELD /<><><><><><><><>

  const field = ({
    name,
    field,
    type,
    value,
    required = false,
    confirm = false,
  }: FieldType): FieldType => ({
    name,
    field: field ?? makeHTMLSafe(name),
    type: type ?? "string",
    value,
    required,
    confirm,
  });

  // <><><><><><><><>\ TEXT /<><><><><><><><>

  const text = (
    label: string,
    options = {
      block: false,
      required: false,
    } as Partial<FieldType>
  ): FieldType => {
    const [name, field] = label.startsWith("$")
      ? [options.name || labelize(label.slice(1)), label.slice(1)]
      : [label, options.field || makeHTMLSafe(label)];

    return {
      name,
      field,
      type: "string",
      value: options.value,
      required: options.required,
      // options: block ? { block: true } : undefined,
    };
  };

  // <><><><><><><><>\ PASSWORD /<><><><><><><><>

  const password = (
    confirm = false,
    options?: Partial<Omit<FieldType, "confirm" | "type">>
  ): FieldType => ({
    name: "Password",
    field: "password",
    type: "password",
    required: true,
    confirm,
    ...options,
  });

  // <><><><><><><><>\ EMAIL /<><><><><><><><>

  const email = (options: Partial<Omit<FieldType, "type">>): FieldType => ({
    name: "Email",
    field: "email",
    type: "email",
    required: false,
    ...options,
  });

  // <><><><><><><><>\ SELECT /<><><><><><><><>

  const select = (
    label: string,
    choices: (string | object)[],
    multi = false,
    options?: Omit<FieldType, "type" | "choices">
  ): FieldType => {
    const [name, field] = label.startsWith("$")
      ? [labelize(label.slice(1)), label.slice(1)]
      : [label, makeHTMLSafe(label)];
    return {
      name,
      field,
      type: "select",
      choices,
      ...options,
      options: {
        multi,
        ...options?.options,
      },
    };
  };

  // <><><><><><><><>\ GROUP /<><><><><><><><>

  const group = (
    label: string,
    subFields: FieldType[],
    options?: Partial<Omit<FieldType, "type" | "subFields">>
  ): FieldType => {
    const [name, field] = label.startsWith("$")
      ? [labelize(label.slice(1)), label.slice(1)]
      : [label, makeHTMLSafe(label)];
    return {
      name,
      field,
      subFields,
      type: "set",
      ...options,
    };
  };

  // %%%%%%%%%%%%%%\ RENDER FIELD /%%%%%%%%%%%%%%

  const renderField = (entry: FieldType) => {
    const { name, type, value, required, field, placeholder } = entry;
    const props: InputPropsType = {
      field,
      value,
      placeholder,
      // handleChange: e => setFormData(prev=>({...prev,[field]:e.value})),
      handleChange: () => {},
    };
    let element = () => {
      switch (type) {
        case "string":
          return <TextField {...props} />;
          break;
        case "number":
          return <NumField {...props} />;
          break;
        case "float":
          return <NumField {...props} step={0.1} />;
          break;
        case "boolean":
          return <Toggle {...props} />;
          break;
        case "date":
          return <DateField {...props} />;
          break;
        case "email":
          return <EmailField {...props} />;
          break;
        case "password":
          return <Password {...props} />;
          break;
        case "select":
          return <div>{`${field} (select)`}</div>;
          break;
        case "set":
          return <div>{`${field} (set)`}</div>;
          break;
        default:
          return <div>{`${field}...?`}</div>;
      }
    };

    return (
      <Label key={field} name={name!} field={field} required={required}>
        {element()}
      </Label>
    );
  };

  const defaultPostMsg = `## Thanks for your feedback!`;

  // <><><><><><><><>\ FORM /<><><><><><><><>

  const form = ({
    name,
    fields,
    validate = false,
    handleSubmit,
    submitTxt,
    resetTxt,
    handleReset,
    postMessage,
  }: FormType) => {
    const newForm: FormDataType = Object.fromEntries(
      fields.map(entry => {
        const { name, value, field, confirm } = entry;
        // console.log({ confirm });
        const element = confirm ? (
          <>
            {renderField(entry)}
            {renderField({
              ...entry,
              name: `Confirm ${field}`,
              field: `confirm-${name}`,
              confirm: false,
            })}
          </>
        ) : (
          renderField(entry)
        );
        return [field, { value, field, element, label: name }];
      })
    );

    console.log({ newForm });
    !formData && setFormData(newForm);

    const submitForm = (e: MouseEvent<HTMLButtonElement>): void => {
      e.preventDefault();
      setSubmitted(true);
      // TODO: IF VALIDATE, VALIDATE
      handleSubmit();
    };

    return (
      <Form name={name} handleSubmit={handleSubmit}>
        <h2>{name}</h2>
        <div className="form-body flex col">
          {Object.values(newForm).map(entry => entry.element)}
        </div>
        <button
          type="submit"
          onClick={(e: MouseEvent<HTMLButtonElement>) => submitForm(e)}
        >
          {submitTxt ?? "Submit"}
        </button>
        <button type="reset" onClick={handleReset}>
          {resetTxt ?? "Reset"}
        </button>
      </Form>
    );
  };

  // ======================================
  // %%%%%%%%%%%%%%\ RETURN /%%%%%%%%%%%%%%
  // ======================================

  return { form, field, password, email, text, group, select };
}
