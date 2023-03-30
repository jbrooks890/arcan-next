import { makeHTMLSafe } from "@/lib/utility";
import Form from "@/components/form/Form";
import {
  ChangeEvent,
  ChangeEventHandler,
  FormEventHandler,
  MouseEvent,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import Label from "@/components/form/Label";
import TextField from "@/components/form/TextField";
import NumField from "@/components/form/NumField";
import Toggle from "@/components/form/Toggle";
import Password from "@/components/form/Password";
import DateField from "@/components/form/DateField";
import EmailField from "@/components/form/EmailField";
import Markdown from "markdown-to-jsx";
import FieldSet from "@/components/form/FieldSet";

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
    step?: number;
  };
};

export type FormDataType = {
  [key: string]: any;
};

export type FormType = {
  name: string;
  fields: FieldType[];
  validate?: boolean;
  submitTxt?: string;
  resetTxt?: string;
  handleReset?: MouseEventHandler<HTMLButtonElement>;
  handleSubmit: (v?: any) => void;
  postMessage?: (v: FormDataType) => string;
};

// =================================================
// %%%%%%%%%%%%%%%%%%\ COMPONENT /%%%%%%%%%%%%%%%%%%
// =================================================

export default function useForm() {
  const [formData, setFormData] = useState<FormDataType>();
  const [formOutput, setFormOutput] = useState();
  // const [submitted, setSubmitted] = useState(false);

  useEffect(() => console.log({ formOutput }), [formOutput]);

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

  // <><><><><><><><>\ PARSE LABEL /<><><><><><><><>

  const parseLabel = (label: string): [name: string, label: string] =>
    label.startsWith("$")
      ? [labelize(label.slice(1)), label.slice(1)]
      : [label, makeHTMLSafe(label)];

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
    block?: false,
    options?: Partial<Omit<FieldType, "type">>
  ): FieldType => {
    const [name, field] = parseLabel(label);

    return {
      name,
      field,
      type: "string",
      ...options,
      options: {
        ...options?.options,
        block,
      },
    };
  };

  // <><><><><><><><>\ NUMBER /<><><><><><><><>

  const number = (
    label: string,
    float = false,
    range?: { min?: number; max?: number },
    options?: Partial<Omit<FieldType, "type">>
  ): FieldType => {
    const [name, field] = parseLabel(label);

    return {
      name,
      field,
      type: float ? "float" : "number",
      ...options,
      options: {
        ...options?.options,
        ...range,
      },
    };
  };

  // <><><><><><><><>\ FLOAT /<><><><><><><><>

  const float = (
    label: string,
    step?: number,
    range?: { min?: number; max?: number },
    options?: Partial<Omit<FieldType, "type">>
  ): FieldType => {
    const [name, field] = parseLabel(label);

    return {
      name,
      field,
      type: "float",
      ...options,
      options: {
        ...options?.options,
        ...range,
        step,
      },
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

  // <><><><><><><><>\ DATE /<><><><><><><><>

  const date = (
    label: string,
    options?: Partial<Omit<FieldType, "type">>
  ): FieldType => {
    const [name, field] = parseLabel(label);

    return {
      name,
      field,
      type: "date",
      ...options,
    };
  };

  // <><><><><><><><>\ BOOLEAN /<><><><><><><><>

  const boolean = (
    label: string,
    options?: Partial<Omit<FieldType, "type">>
  ): FieldType => {
    const [name, field] = parseLabel(label);
    return {
      name,
      field,
      type: "boolean",
      ...options,
    };
  };

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

  // <><><><><><><><>\ CONDITION /<><><><><><><><>

  // NOT RENDERED AS PART OF THE OUTPUT BUT EFFECTS THE VALUE OF PARENT
  const condition = (label: string, options: Omit<FieldType, "type">) => {};

  // %%%%%%%%%%%%%%\ UPDATE FIELD /%%%%%%%%%%%%%%

  const updateField = (e, field, parent) => {
    console.log({ parent });
    setFormOutput(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // %%%%%%%%%%%%%%\ RENDER FIELD /%%%%%%%%%%%%%%

  const renderField = (
    entry: FieldType,
    // ancestors: string[] = [],
    parent?: object,
    changeHandler?: ChangeEventHandler<HTMLInputElement>
  ) => {
    const {
      name,
      field,
      subFields,
      type,
      value,
      required,
      placeholder,
      validation,
      confirm,
    } = entry;

    const props: InputPropsType = {
      field,
      value,
      placeholder,
      handleChange: e => {
        changeHandler ? changeHandler(e) : updateField(e, field, parent);
      },
    };

    let element = () => {
      switch (type) {
        case "string":
          return <TextField {...props} />;
        case "number":
          return (
            <NumField
              {...props}
              min={entry.options?.min}
              max={entry.options?.max}
            />
          );
        case "float":
          return (
            <NumField
              {...props}
              min={entry.options?.min}
              max={entry.options?.max}
              step={entry.options?.step ?? 0.1}
            />
          );
        case "boolean":
          return <Toggle {...props} />;
        case "date":
          return <DateField {...props} />;
        case "email":
          return <EmailField {...props} />;
        case "password":
          return <Password {...props} />;
        case "select":
          return <div>{`${field} ( select )`}</div>;
        case "set":
          return <>{entry.subFields!.map(field => renderField(field))}</>;
        default:
          return <div>{`${field}...?`}</div>;
      }
    };

    const Container = subFields ? FieldSet : Label;

    return (
      <>
        <Container
          key={field}
          name={name!}
          field={field}
          required={required}
          criteria={
            Array.isArray(validation)
              ? validation?.map(validator => validator.criteria)
              : undefined
          }
          className={subFields ? "flex col" : ""}
        >
          {element()}
        </Container>
        {confirm &&
          renderField({
            ...entry,
            name: `Confirm ${field}`,
            field: `confirm-${name}`,
            confirm: false,
            validation: undefined,
          })}
      </>
    );
  };

  // %%%%%%%%%%%%%%\ VALIDATE FORM /%%%%%%%%%%%%%%

  const validateForm = () => {
    Object.entries(formData!).forEach(([field, { required, validation }]) => {
      const multi = Array.isArray(validation);
    });
  };

  // _____________________________________________

  const defaultPostMsg = () => `## Thanks for your feedback!`;

  const isSubmitted = () => formData?.submitted;

  // <><><><><><><><>\ FORM /<><><><><><><><>

  const form = ({
    name,
    fields,
    validate = false,
    resetTxt,
    submitTxt,
    handleReset,
    handleSubmit,
    postMessage = defaultPostMsg,
  }: FormType) => {
    // -=-=-=-=-=-=-=-=-\ GET FIELD DATA /-=-=-=-=-=-=-=-=-

    const getFieldData = (
      fields: FieldType[],
      // ancestors: string[] = []
      parent?: object
    ): FormDataType => {
      // -------------\ RETRIEVE /-------------

      const retrieve = (fields: FieldType[], properties?: string[]) => {
        return Object.fromEntries(
          fields.map(entry => {
            let { field, subFields, ...data } = entry;
            data = properties?.length
              ? Object.fromEntries(properties.map(key => [key, data[key]]))
              : data;
            subFields && Object.assign(data, retrieve(subFields));
            return [field, data];
          })
        );
      };

      const [formData, formElements, formOutput] = fields
        .map(entry => {
          const { field, type, subFields, value, ...data } = entry;
          const element = renderField(entry, parent);
          const result = [
            [
              field,
              {
                type,
                element,
                ...data,
                subFields: subFields
                  ? getFieldData(subFields, {
                      [field]: parent?.[field],
                    })
                  : null,
              },
            ],
            [field, element],
            [
              field,
              subFields ? retrieve(subFields, ["value"]) : value ?? undefined,
            ],
          ];
          return result;
        })
        .reduce(
          ([_data, _elements, _outputs], [data, element, output]) => {
            return [
              [..._data, data],
              [..._elements, element],
              [..._outputs, output],
            ];
          },
          [[], [], []]
        );

      return Object.fromEntries([
        ["data", Object.fromEntries(formData)],
        ["elements", Object.fromEntries(formElements)],
        ["initialOutput", Object.fromEntries(formOutput)],
      ]);
    };

    // const newForm: FormDataType = renderFields(fields);
    const newForm: FormDataType = getFieldData(fields);

    console.log({ newForm });
    !formData && setFormData({ ...newForm, validation: {}, submitted: false });
    !formOutput && setFormOutput(newForm.initialOutput);

    const submitForm: FormEventHandler<HTMLFormElement> = (
      e: MouseEvent<HTMLButtonElement>
    ): void => {
      e.preventDefault();
      handleSubmit();
      setFormData(prev => ({ ...prev, submitted: true }));
      // TODO: IF VALIDATE, VALIDATE
    };

    const resetForm: FormEventHandler<HTMLFormElement> = e => {
      e.preventDefault();
      setFormData(formData.initialOutput);
    };

    return formData?.submitted ? (
      <Markdown className={`post-submit-msg`} options={{ forceBlock: true }}>
        {postMessage(formOutput!)}
      </Markdown>
    ) : (
      <Form
        name={name}
        validate={validate}
        className="flex col"
        handleSubmit={submitForm}
        handleReset={resetForm}
        submitTxt={submitTxt}
        resetTxt={resetTxt}
      >
        {/* {Object.values(newForm).map(entry => entry.element)} */}
        {Object.values(newForm.elements)}
      </Form>
    );
  };

  // ======================================
  // %%%%%%%%%%%%%%\ RETURN /%%%%%%%%%%%%%%
  // ======================================

  return {
    form,
    field,
    text,
    number,
    float,
    boolean,
    password,
    email,
    date,
    group,
    select,
    isSubmitted,
  };
}
