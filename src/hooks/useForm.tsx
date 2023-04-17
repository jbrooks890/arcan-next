"use client";
import {
  ChangeEvent,
  ChangeEventHandler,
  createElement,
  Dispatch,
  FormEventHandler,
  MouseEvent,
  MouseEventHandler,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Form from "@/components/form/Form";
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
import useFormInputs from "./useFormInputs";
import type { FormType } from "@/components/form/Form";

export enum FieldTypeEnum {
  string,
  number,
  float,
  boolean,
  checkbox,
  date,
  email,
  password,
  set,
  modifier,
  select,
  symbol,
}
type validatorFn = (v: any, source?: object) => boolean | Promise<boolean>;

type validatorObj = {
  validator: validatorFn;
  criteria?: string;
  error?: string;
};

export type FieldType<T = string> = {
  name: string;
  field: string;
  type: keyof typeof FieldTypeEnum;
  value?: any;
  placeholder?: string;
  required?: boolean;
  confirm?: boolean;
  choices?: (T | object)[] | { [key: string]: T };
  children?: FieldType<T>[];
  validation?: validatorFn | validatorObj[];
  labelize?: boolean;
  aux?: boolean;
  handleChange?: ChangeEventHandler<
    HTMLInputElement | HTMLButtonElement | HTMLTextAreaElement
  >;
  options?: {
    Element?: JSX.Element | ReactElement;
    block?: boolean;
    inline?: boolean;
    min?: number;
    max?: number;
    multi?: boolean;
    step?: number;
  };
};

export type FormMasterType = {
  [key: string]: any;
};

type UseFormType = Omit<FormType<FormMasterType>, "children"> & {
  fields: FieldType[];
};

// =================================================
// %%%%%%%%%%%%%%%%%%\ COMPONENT /%%%%%%%%%%%%%%%%%%
// =================================================

export default function useForm() {
  const [formMaster, setFormMaster] = useState<FormMasterType>();
  const [formData, setFormData] = useState();
  // const [submitted, setSubmitted] = useState(false);
  const INPUTS = useFormInputs();

  useEffect(() => console.log({ formData }), [formData]);
  useEffect(() => formMaster && console.log({ formMaster }), [formMaster]);

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
      options: entry_options,
      handleChange,
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

    // const { Element } = entry_options;

    let element = () => {
      if (type === "select") {
        return (
          <SelectMaster
            options={entry.choices}
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

  // const defaultPostMsg = () => `## Thanks for your feedback!`;

  const isSubmitted = () => formMaster?.submitted;

  // <><><><><><><><>\ FORM /<><><><><><><><>

  const form = ({
    name,
    fields,
    validate = false,
    autoComplete = false,
    spellCheck = false,
    resetTxt,
    submitTxt,
    id,
    className,
    useSummary = false,
    handleReset,
    handleSubmit,
    postMessage,
  }: UseFormType) => {
    const newForm: FormMasterType = getFieldData(expand(fields));

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
        {postMessage?.(formData!) ?? "Submitted"}
      </Markdown>
    ) : (
      <Form
        name={name}
        validate={validate}
        id={id}
        className={className}
        autoComplete={autoComplete}
        spellCheck={spellCheck}
        handleSubmit={submitForm}
        handleReset={resetForm}
        submitTxt={submitTxt}
        resetTxt={resetTxt}
        useSummary={useSummary}
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
    isSubmitted,
    getValue,
    render: renderField,
    ...INPUTS,
  };
}
