"use client";
import { makeHTMLSafe } from "@/lib/utility";
import Form from "@/components/form/Form";
import {
  ChangeEvent,
  ChangeEventHandler,
  createElement,
  Dispatch,
  FormEventHandler,
  Fragment,
  MouseEvent,
  MouseEventHandler,
  ReactElement,
  SetStateAction,
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
import { capitalize } from "@/utility/helperFns";
import Checkbox from "@/components/form/Checkbox";

export type FieldTypeEnum =
  | "string"
  // | "block"
  | "number"
  | "float"
  | "boolean"
  | "checkbox"
  | "date"
  | "email"
  | "password"
  | "set"
  | "modifier"
  | "select";
// | "multi";

type validatorFn = (v: any, source?: object) => boolean | Promise<boolean>;

type validatorObj = {
  validator: validatorFn;
  criteria?: string;
  error?: string;
};

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
  validation?: validatorFn | validatorObj[];
  labelize?: boolean;
  aux?: boolean;
  options?: {
    block?: boolean;
    inline?: boolean;
    min?: number;
    max?: number;
    multi?: boolean;
    step?: number;
    Element?: JSX.Element;
  };
};

export type FormMasterType = {
  [key: string]: any;
};

export type FormType = {
  name?: string;
  fields: FieldType[];
  validate?: boolean;
  submitTxt?: string;
  resetTxt?: string;
  handleReset?: MouseEventHandler<HTMLButtonElement>;
  handleSubmit: (v?: any) => void;
  postMessage?: (v: FormMasterType) => string;
};

// =================================================
// %%%%%%%%%%%%%%%%%%\ COMPONENT /%%%%%%%%%%%%%%%%%%
// =================================================

export default function useForm() {
  const [formMaster, setFormMaster] = useState<FormMasterType>();
  const [formData, setFormData] = useState();
  // const [submitted, setSubmitted] = useState(false);

  useEffect(() => console.log({ formData }), [formData]);
  useEffect(() => formMaster && console.log({ formMaster }), [formMaster]);

  // <><><><><><><><>\ LABELIZE /<><><><><><><><>

  const labelize = (str: string, isArray = false) => {
    let label = str;
    if (/[a-z]/.test(label.charAt(0)))
      label = label.replace(/([A-Z])/g, " $1").toLowerCase();

    if (label.startsWith("_")) label = label.slice(1);

    const shorthands = {
      pref: "preference",
      ref: "reference",
      attr: "attribute",
      org: "organization",
      diffr: "differential",
      intro: "introduction",
      avg: "average",
      dob: "date of birth",
      abbr: "abbreviation",
      msg: "message",
      qty: "quantity",
    };

    const nonPlurals = ["s", "y"];

    Object.entries(shorthands).forEach(([short, long]) => {
      const regex = new RegExp(`\\b${short}\\b`);
      if (label.match(regex)) label = label.replace(regex, long);
    });
    if (isArray && !nonPlurals.includes(label.charAt(label.length - 1)))
      label += "(s)";
    if (label.startsWith("is ")) label = label.slice(2) + "?";
    return label;
  };

  // <><><><><><><><>\ PARSE LABEL /<><><><><><><><>

  type ParseLabelType = [name: string, field: string, required?: boolean];

  const parseLabel = (label: string): ParseLabelType => {
    const required = label.endsWith("*") ?? undefined;
    if (required) label = label.slice(0, -1);

    const output: [name: string, field: string] = label.startsWith("$")
      ? [labelize(label.slice(1)), label.slice(1)]
      : [label, makeHTMLSafe(label)];

    return [...output, required];
  };

  // <><><><><><><><>\ SHORTHAND /<><><><><><><><>

  const shorthand = (label: string) => {};

  // <><><><><><><><>\ FIELD /<><><><><><><><>

  const field = ({
    name,
    field,
    type,
    value,
    required = false,
    confirm = false,
  }: FieldType): FieldType => {
    // value !== undefined && console.log({ field, value });
    return {
      name,
      field: field ?? makeHTMLSafe(name),
      type: type ?? "string",
      value,
      required,
      confirm,
    };
  };

  // <><><><><><><><>\ TEXT /<><><><><><><><>

  const text = (
    label: string,
    block?: false,
    options?: Partial<Omit<FieldType, "type">>
  ): FieldType => {
    const [name, field, required] = parseLabel(label);

    return {
      name,
      field,
      required,
      ...options,
      type: "string",
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
    const [name, field, required] = parseLabel(label);

    return {
      name,
      field,
      required,
      ...options,
      type: float ? "float" : "number",
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
    const [name, field, required] = parseLabel(label);

    return {
      name,
      field,
      required,
      ...options,
      type: "float",
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
    const [name, field, required] = parseLabel(label);

    return {
      name,
      field,
      required,
      type: "date",
      ...options,
    };
  };

  // <><><><><><><><>\ BOOLEAN /<><><><><><><><>

  const boolean = (
    label: string,
    checkbox = false,
    options?: Partial<Omit<FieldType, "type">>
  ): FieldType => {
    const [name, field, required] = parseLabel(label);

    return {
      name,
      field,
      required,
      type: checkbox ? "checkbox" : "boolean",
      ...options,
      options: {
        ...options?.options,
        inline: true,
      },
    };
  };

  // const checkbox = (...args:<Parameters<typeof boolean>>) => {
  //   return boolean(...args)
  // }

  // <><><><><><><><>\ SELECT /<><><><><><><><>

  const select = (
    label: string,
    choices: (string | object)[],
    multi = false,
    options?: Omit<FieldType, "type" | "choices">
  ): FieldType => {
    const [name, field, required] = parseLabel(label);
    return {
      name,
      field,
      type: "select",
      required,
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
    const [name, field, required] = parseLabel(label);
    return {
      name,
      field,
      required,
      children,
      type: "set",
      ...options,
    };
  };

  // <><><><><><><><>\ CONDITION /<><><><><><><><>

  // NOT RENDERED AS PART OF THE OUTPUT BUT EFFECTS THE VALUE OF PARENT
  const condition = (
    label: string,
    operation: Function,
    options?: Omit<FieldType, "type">
  ): FieldType => {
    const [name, field, required] = parseLabel(label);
    return {
      name,
      field,
      required,
      type: "modifier",
      ...options,
    };
  };

  // <><><><><><><><>\ (GET) VALUE /<><><><><><><><>

  const getValue = (field: string, source = formData) => {
    const chain = field.includes(".") ? field.split(".") : undefined;
    return (
      chain?.reduce((parent, child) => parent[child], source) ?? source![field]
    );
  };

  // %%%%%%%%%%%%%%\ EXPAND (FIELDS) /%%%%%%%%%%%%%%

  const expand = (
    fields: FieldType[],
    ancestors: string[] = []
  ): FieldType[] => {
    const expanded = [...fields];
    fields.forEach((entry, i) => {
      const { field, name, confirm } = entry;
      let index = expanded.indexOf(entry);
      confirm &&
        expanded.splice(++index, 0, {
          ...entry,
          name: `Confirm ${name}`,
          field: `confirm${capitalize(field)}`,
          confirm: false,
          aux: true,
          validation: [
            {
              error: `${name}s do not match`,
              validator: (v, source) => {
                const compareValue = ancestors!.reduce(
                  (parent, child) => parent[child],
                  source!
                )[field];
                console.log({ compareValue });
                return v === compareValue;
              },
            },
          ],
        });
    });
    return expanded;
  };

  // %%%%%%%%%%%%%%\ RENDER FIELD /%%%%%%%%%%%%%%

  const renderField = (
    entry: FieldType,
    ancestors: string[] = [],
    options?: {
      changeHandler?: ChangeEventHandler<HTMLInputElement>;
      source?: object;
      updater?: Dispatch<SetStateAction<any>>;
    }
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
      // confirm,
    } = entry;

    const PATH = [...ancestors, field];
    const CHAIN = PATH.join("-");
    const parent = ancestors.reduce(
      (_parent, child) => _parent?.[child],
      formData
    );
    const value = parent?.[field] ?? defaultValue;

    const props: Omit<InputPropsType, "handleChange"> = {
      field,
      value,
      placeholder,
    };

    const updateNestedValue = (
      source = formData,
      value: any,
      target = field
    ) => {
      return ancestors.length
        ? ancestors
            .reduce<any[]>(
              (chain, current) => {
                const parent = chain.pop();
                const [key, obj] = parent;
                const child = [current, obj[key]];

                return [...chain, parent, child];
              },
              [[ancestors.shift() ?? target, source]]
            )
            .reduceRight(
              (data, [path, parent]) => {
                const child = { ...parent[path], ...data };
                return { ...parent, [path]: child };
              },
              { [target]: value }
            )
        : {
            ...(options?.source ?? source),
            [field]: value,
          };
    };

    const updateValue = (
      value: any,
      updater = options?.updater ?? setFormData
    ) => {
      updater($STATE => updateNestedValue($STATE, value));
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
        case "checkbox":
          return (
            <Checkbox
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
        default:
          return <div>{`${field}...?`}</div>;
      }
    };

    const parentName = ancestors?.length && [...ancestors].pop();
    const junior = parentName && name.match(new RegExp(parentName, "i"));

    const wrapperProps = {
      name: junior ? name!.replace(parentName, "").trim() : name!,
      field,
      required,
      criteria: Array.isArray(validation)
        ? validation.map(validator => validator.criteria).filter(Boolean)
        : "",
      validated: !!formMaster?.validation,
      inline: entry.options?.inline,
    };
    const error = ancestors.reduce(
      (parent, child) => parent?.[child],
      formMaster?.validation
    )?.[field];

    if (error) wrapperProps.error = error;

    return children ? (
      <FieldSet
        key={CHAIN}
        {...wrapperProps}
        inline={!entry.options?.block && children?.length < 3}
        children={[]}
      />
    ) : (
      <Label key={CHAIN} {...wrapperProps}>
        {element()}
      </Label>
    );
  };

  // %%%%%%%%%%%%%%\ VALIDATE FIELD /%%%%%%%%%%%%%%

  const validateField = (field: string, ancestors: string[] = []) => {
    const parent = ancestors.reduce((obj, path) => obj[path], formMaster);
  };

  // %%%%%%%%%%%%%%\ VALIDATE FORM /%%%%%%%%%%%%%%

  const validateForm = () => {
    const validateObj = (source: object, ancestors: string[] = []) => {
      return Object.fromEntries(
        Object.entries(source.data)
          .filter(
            ([_, { required, validation, children }]) =>
              required || !!validation || !!children
          )
          .map(([field, { name, required, validation, children }]) => {
            // console.log({ field, required, validation });
            const FAILS = ["", undefined, null, NaN];
            const VALUE = ancestors.reduce(
              (parent, child) => parent[child],
              formData
            )[field];

            // console.log({ children: !!children });
            let nested;
            if (children) nested = validateObj(children, [...ancestors, field]);
            // ancestors.length && console.log({ field, VALUE });

            if (required && FAILS.includes(VALUE))
              return [field, "required field"];

            if (validation) {
              // console.log({ validation });
              if (Array.isArray(validation))
                for (const { validator, error } of validation) {
                  // console.log({ VALUE, isValid: validator(VALUE) });
                  if (!validator(VALUE, formData))
                    return [field, error ?? `Invalid ${capitalize(name)}`];
                }
              else {
                if (!validation(VALUE, formData))
                  return [field, `Invalid ${capitalize(name)}`];
              }
            }
            return [
              field,
              !!nested && Object.keys(nested).length ? nested : false,
            ];
          })
          .filter(([_, value]) => !!value)
      );
    };
    const result = validateObj(formMaster!);
    console.log({ result });
    setFormMaster(prev => ({
      ...prev,
      validation: result,
    }));
  };

  // %%%%%%%%%%%%%%\ GET FIELD DATA /%%%%%%%%%%%%%%

  type GetFieldsDataType = {
    data: FormMasterType;
    elements: { [key: string]: ReactElement };
    // ^^ TODO: key should be generic: keyof data
    initialOutput: object;
  };

  const getFieldData = (
    fields: FieldType[],
    ancestors: string[] = [] // TODO
  ): GetFieldsDataType => {
    type FieldDataOutput = Omit<FieldType, "field" | "confirm"> & {
      element: ReactElement | ReactElement[];
      aux?: Omit<GetFieldsDataType, "initialOutput"> & {
        values: object;
      };
      children?: GetFieldsDataType;
    };

    const [_formMaster, _formElements, _formData] = fields
      .map(entry => {
        const { field, type, children, confirm, value, ...data } = entry;
        const parent = [...ancestors, field];
        const element = renderField(entry, ancestors);

        if (children)
          data.children = getFieldData(expand(children, parent), parent);

        const summary: FieldDataOutput = {
          type,
          element,
          ...data,
        };

        return [
          [field, summary],
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
          [field, children ? data.children.initialOutput : value ?? undefined],
        ];
      })
      .reduce(
        ([_data, _elements, _outputs], [data, element, output]) => [
          [..._data, data],
          [..._elements, element],
          [..._outputs, output],
        ],
        [[], [], []]
      );

    // console.log({ _formMaster, _formElements, _formData });

    return {
      data: Object.fromEntries(_formMaster),
      elements: Object.fromEntries(_formElements),
      initialOutput: Object.fromEntries(_formData),
    };
  };

  // _____________________________________________

  const defaultPostMsg = () => `## Thanks for your feedback!`;

  const isSubmitted = () => formMaster?.submitted;

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
    // const newForm: FormMasterType = renderFields(fields);

    // console.log({ fields });

    const newForm: FormMasterType = getFieldData(expand(fields));

    // console.log({ newForm });
    !formMaster &&
      setFormMaster({ ...newForm, validation: undefined, submitted: false });
    !formData && setFormData(newForm.initialOutput);

    const purge = obj => {
      return Object.fromEntries(
        Object.entries(obj).filter(([field, data]) =>
          typeof data === "object" ? purge(data) : !formMaster?.[field].aux
        )
      );
    };

    const submitForm: FormEventHandler<HTMLFormElement> = (
      e: MouseEvent<HTMLButtonElement>
    ): void => {
      e.preventDefault();
      handleSubmit();
      validateForm();
      // setFormMaster(prev => ({ ...prev, submitted: true }));
      // TODO: IF VALIDATE, VALIDATE
    };

    const resetForm: FormEventHandler<HTMLFormElement> = e => {
      e.preventDefault();
      setFormMaster(formMaster?.initialOutput);
    };

    return formMaster?.submitted ? (
      <Markdown className={`post-submit-msg`} options={{ forceBlock: true }}>
        {postMessage(formData!)}
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
    getValue,
  };
}
