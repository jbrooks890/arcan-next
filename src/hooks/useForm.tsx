"use client";
import { makeHTMLSafe } from "@/lib/utility";
import Form from "@/components/form/Form";
import {
  ChangeEvent,
  ChangeEventHandler,
  createElement,
  FormEventHandler,
  Fragment,
  MouseEvent,
  MouseEventHandler,
  ReactElement,
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
import FieldSet from "@/components/form/FieldSet";
import Markdown from "markdown-to-jsx";
import ChoiceBox from "@/components/form/ChoiceBox";
import SelectMaster from "@/components/form/SelectMaster";

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
  children?: FieldType[];
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
    children: FieldType[],
    options?: Partial<Omit<FieldType, "type" | "children">>
  ): FieldType => {
    const [name, field] = label.startsWith("$")
      ? [labelize(label.slice(1)), label.slice(1)]
      : [label, makeHTMLSafe(label)];
    return {
      name,
      field,
      children,
      type: "set",
      ...options,
    };
  };

  // <><><><><><><><>\ CONDITION /<><><><><><><><>

  // NOT RENDERED AS PART OF THE OUTPUT BUT EFFECTS THE VALUE OF PARENT
  const condition = (label: string, options: Omit<FieldType, "type">) => {};

  // %%%%%%%%%%%%%%\ RENDER FIELD /%%%%%%%%%%%%%%

  const renderField = (
    entry: FieldType,
    ancestors: string[] = [],
    changeHandler?: ChangeEventHandler<HTMLInputElement>
  ): ReactElement | ReactElement[] => {
    const {
      name,
      field,
      children,
      type,
      value: defaultValue,
      required,
      placeholder,
      validation,
      confirm,
    } = entry;

    const PATH = [...ancestors, field];
    const CHAIN = PATH.join("-");
    const parent = ancestors.reduce(
      (_parent, child) => _parent?.[child],
      formOutput
    );
    const value = parent?.[field] ?? defaultValue;

    const props: Omit<InputPropsType, "handleChange"> = {
      field,
      value,
      placeholder,
    };

    const updateValue = (value: any) => {
      setFormOutput($STATE => {
        return ancestors.length
          ? ancestors
              .reduce<any[]>(
                (chain, current) => {
                  const parent = chain.pop();
                  const [key, obj] = parent;
                  const child = [current, obj[key]];

                  return [...chain, parent, child];
                },
                [[ancestors.shift() ?? field, $STATE]]
              )
              .reduceRight(
                (data, [path, parent]) => {
                  const child = { ...parent[path], ...data };
                  return { ...parent, [path]: child };
                },
                { [field]: value }
              )
          : {
              ...$STATE,
              [field]: value,
            };
      });
    };

    let element = () => {
      if (type === "select") {
        return (
          <SelectMaster
            options={Array.isArray(entry.choices) ? entry.choices : []}
            field={CHAIN}
            multi={entry.options?.multi}
            value={value}
            handleChange={updateValue}
          />
        );
      }

      switch (type) {
        case "string":
          return (
            <TextField
              {...props}
              handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateValue(e.target.value)
              }
            />
          );
        case "number":
          return (
            <NumField
              {...props}
              min={entry.options?.min}
              max={entry.options?.max}
              handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateValue(e.target.value)
              }
            />
          );
        case "float":
          return (
            <NumField
              {...props}
              min={entry.options?.min}
              max={entry.options?.max}
              step={entry.options?.step ?? 0.1}
              handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateValue(e.target.value)
              }
            />
          );
        case "boolean":
          return (
            <Toggle
              {...props}
              handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateValue(e.target.checked)
              }
            />
          );
        case "date":
          return (
            <DateField
              {...props}
              handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateValue(e.target.value)
              }
            />
          );
        case "email":
          return (
            <EmailField
              {...props}
              handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateValue(e.target.value)
              }
            />
          );
        case "password":
          return (
            <Password
              {...props}
              handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateValue(e.target.value)
              }
            />
          );
        case "select":
          return <div>{`${field} ( select )`}</div>;
        default:
          return <div>{`${field}...?`}</div>;
      }
    };

    const wrapperProps = {
      name: name!,
      field,
      required,
      criteria: Array.isArray(validation)
        ? validation?.map(validator => validator.criteria)
        : undefined,
      className: children ? "flex col" : "",
    };

    return children ? (
      <FieldSet key={CHAIN} {...wrapperProps} children={[]} />
    ) : confirm ? (
      <Fragment key={CHAIN}>
        <Label key={CHAIN} {...wrapperProps}>
          {element()}
        </Label>
        {confirm &&
          renderField({
            ...entry,
            name: `Confirm ${field}`,
            field: `confirm-${name}`,
            confirm: false,
            validation: undefined,
          })}
      </Fragment>
    ) : (
      <Label key={CHAIN} {...wrapperProps}>
        {element()}
      </Label>
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

    type GetFieldsDataType = {
      data: FormDataType;
      elements: { [key: string]: ReactElement };
      // ^^ TODO: key should be generic: keyof data
      initialOutput: object;
    };

    const getFieldData = (
      fields: FieldType[],
      ancestors: string[] = [] // TODO
    ): GetFieldsDataType => {
      // !!ancestors.length && console.log({ ancestors });

      const [_formData, _formElements, _formOutput] = fields
        .map(entry => {
          const { field, type, children, value, ...data } = entry;
          const parent = [...ancestors, field];
          const element = renderField(entry, ancestors);
          if (children) data.children = getFieldData(children, parent);
          const output = {
            type,
            element,
            ...data,
          };
          const result = [
            [field, output],
            [
              field,
              children
                ? createElement(
                    FieldSet,
                    { ...element.props, key: element.key },
                    Object.values(data.children.elements)
                  )
                : element,
            ],
            [
              field,
              children ? data.children.initialOutput : value ?? undefined,
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

      return {
        data: Object.fromEntries(_formData),
        elements: Object.fromEntries(_formElements),
        initialOutput: Object.fromEntries(_formOutput),
      };
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
      setFormData(formData?.initialOutput);
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
