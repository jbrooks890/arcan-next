"use client";
import {
  ChangeEvent,
  ChangeEventHandler,
  ComponentType,
  createElement,
  DetailedHTMLProps,
  Dispatch,
  FormEventHandler,
  Fragment,
  HTMLAttributes,
  HTMLInputTypeAttribute,
  MouseEvent,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  SetStateAction,
  useEffect,
  useReducer,
  useState,
} from "react";
import Form from "@/components/form/Form";
import Toggle from "@/components/form/Toggle";
import Password from "@/components/form/Password";
import FieldSet from "@/components/form/FieldSet";
import Markdown from "markdown-to-jsx";
import SelectMaster from "@/components/form/SelectMaster";
import { capitalize } from "@/utility/helperFns";
import Checkbox from "@/components/form/Checkbox";
import useFormInputs from "./useFormInputs";
import type { FormType } from "@/components/form/Form";
import Input from "@/components/form/Input";
import InputWrapper from "@/components/form/InputWrapper";

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

enum SimpleTypes {
  string,
  number,
  boolean,
  Date,
  email,
}

export type FieldType = {
  name: string;
  field: string;
  type: keyof typeof FieldTypeEnum;
  value?: any;
  placeholder?: string;
  required?: boolean;
  confirm?: boolean;
  choices?: (string | object)[] | { [key: string]: string };
  children?: FieldType[];
  validation?: validatorFn | validatorObj[];
  labelize?: boolean;
  aux?: boolean;
  handleChange?: ChangeEventHandler<
    HTMLInputElement | HTMLButtonElement | HTMLTextAreaElement
  >;
  options?: {
    Element?: ReactElement;
    block?: boolean;
    inline?: boolean;
    min?: number;
    max?: number;
    multi?: boolean;
    step?: number;
    other?: boolean;
  };
};

export type FormMasterType = {
  data: { [key: string]: any };
  elements: { [key: string]: any };
  initialOutput: { [key: string]: any };
};

export type FieldsDataType = {
  data: FormMasterType;
  elements: { [key: string]: ReactElement };
  // ^^ TODO: key should be generic: keyof data
  initialOutput: object;
};

type FormAPIType = Omit<FormType<FormMasterType>, "children"> & {
  fields: FieldType[];
  handleSubmit: Function;
};

type State = {
  master: FormMasterType;
  data: FormMasterType["initialOutput"]; // TODO
  submitted: boolean;
  errors: undefined | {}; // TODO
} | null;

type Action =
  | {
      type: "init";
      payload: FormMasterType;
    }
  | { type: "update"; payload: {} }
  | { type: "validate"; payload: any }
  | { type: "submit" | "reset"; payload?: undefined };

// =================================================
// %%%%%%%%%%%%%%%%%%\ COMPONENT /%%%%%%%%%%%%%%%%%%
// =================================================

export default function useForm() {
  // [ REDUCER ] --------------------------------------------------------
  const reducer = (state: State, action: Action) => {
    const { type, payload } = action;
    switch (type) {
      case "init":
        return {
          master: payload,
          data: payload.initialOutput,
          errors: undefined,
          submitted: false,
        };
      case "update":
        return {
          ...state,
          data: {
            ...state!.data,
            ...payload,
          },
        };
      case "validate":
        return {
          ...state,
          errors: payload,
        };
      case "submit":
        return {
          ...state,
          submitted: true,
        };
      case "reset":
        if (state) {
          return {
            master: state?.master,
            data: state?.master.initialOutput,
            errors: undefined,
            submitted: false,
          };
        } else {
          console.warn("RESET IGNORED: Nothing to reset!");
        }
      default:
        return state;
    }
  };
  // --------------------------------------------------------------------
  const [state, dispatch] = useReducer(reducer, null);
  const [formMaster, setFormMaster] = useState<FormMasterType>();
  const [formData, setFormData] = useState();
  // const [submitted, setSubmitted] = useState(false);
  const INPUTS = useFormInputs();

  useEffect(() => {
    if (state) {
      const { master, data } = state;
      console.log({ master, data });
    }
  }, [state]);

  // <><><><><><><><>\ (GET) VALUE /<><><><><><><><>

  const getValue = (field: string, source = state?.data) => {
    const chain = field.includes(".") ? field.split(".") : undefined;
    return (
      chain?.reduce((parent, child) => parent![child], source) ?? source![field]
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

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // %%%%%%%%%%%%%%\ RENDER FIELD /%%%%%%%%%%%%%%
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
      state?.data
    );
    const value = parent?.[field] ?? defaultValue;

    const updateNestedValue = (
      source = state?.data,
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

    const updateValue = (value: any, updater = options?.updater) => {
      // updater(STATE => updateNestedValue(STATE, value));
      dispatch({
        type: "update",
        payload: updateNestedValue(state?.data, value),
      });
    };

    // ~~~~~~~~~~~\ ELEMENT /~~~~~~~~~~~
    const SIMPLE_TYPES = {
      string: "text",
      number: "number",
      float: "number",
      email: "email",
      date: "date",
    };

    const parentName = ancestors?.length && [...ancestors].pop();
    const junior = parentName && name.match(new RegExp(parentName, "i"));
    const criteriaList = Array.isArray(validation)
      ? validation
          .filter(validator => validator.criteria)
          .map(validator => validator.criteria)
      : undefined;

    const wrapperProps: InputWrapperType = {
      name: junior ? name!.replace(parentName, "").trim() : name!,
      field: CHAIN,
      required,
      criteria: criteriaList?.length ? criteriaList : "",
      validated: !!state?.master?.validation,
      inline: entry.options?.inline,
    };

    const error = ancestors.reduce(
      (parent, child) => parent?.[child],
      state?.master?.validation
    )?.[field];

    if (error) wrapperProps.error = error;
    if (children) wrapperProps.group = true;

    const props: Omit<InputPropsType, "handleChange"> = {
      field: CHAIN,
      value,
      placeholder,
      wrapper: wrapperProps,
    };

    let ELEMENT = () => {
      // =========> EXTERNAL <=========
      if (entry_options?.Element) {
        const { Element } = entry_options;
        const { type, props: elementProps } = Element;
        // console.log({ Element, elementProps });

        const handleChange = (entry: unknown) => updateValue(entry);
        const $props = {
          ...props,
          ...elementProps,
          handleChange,
        };

        return createElement(type, $props);
      }

      Object.assign(props, { value });
      // =========> SELECT <=========
      if (type === "select") {
        // console.log({ field, ancestors });

        return (
          <SelectMaster
            options={entry.choices}
            // field={CHAIN}
            multi={entry.options?.multi}
            other={entry.options?.other}
            // value={value}
            handleChange={updateValue}
            {...props}
            // wrapper={wrapperProps}
          />
        );
      }

      // =========> SIMPLE TYPES <=========

      if (Object.keys(SIMPLE_TYPES).includes(type)) {
        return (
          <Input
            type={SIMPLE_TYPES[type]}
            handleChange={(e: ChangeEvent<HTMLInputElement>) =>
              updateValue(e.target.value)
            }
            min={entry.options?.min}
            max={entry.options?.max}
            step={entry.options?.step ?? 0.1}
            // wrapper={wrapperProps}
            {...props}
          />
        );
      }

      // =========> OTHERS <=========

      switch (type) {
        case "boolean":
          return (
            <Toggle
              {...props}
              // handleChange={() => updateValue(!value)}
              handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateValue(e.currentTarget.checked)
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
        case "password":
          return (
            <InputWrapper {...wrapperProps}>
              <Password
                {...props}
                handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updateValue(e.target.value)
                }
              />
            </InputWrapper>
          );
        default:
          return <div>{`${field}...?`}</div>;
      }
    };

    return children ? (
      <InputWrapper
        key={CHAIN}
        {...wrapperProps}
        // inline={!entry.options?.block && children?.length < 3}
        children={[]}
      />
    ) : (
      <Fragment key={CHAIN}>{ELEMENT()}</Fragment>
    );
  };

  // %%%%%%%%%%%%%%\ RENDER EACH (FIELD) /%%%%%%%%%%%%%%
  const renderEach = (
    // field: string,
    fields: FieldType[],
    ancestors = [],
    options?: {
      changeHandler?: ChangeEventHandler<HTMLInputElement>;
      source?: object;
      updater?: Dispatch<SetStateAction<any>>;
    }
  ): ReactNode => {
    return (
      <>
        {fields.map(field =>
          field.children ? renderEach(field.children) : renderField(field)
        )}
      </>
    );
  };

  // %%%%%%%%%%%%%%\ VALIDATE FIELD /%%%%%%%%%%%%%%

  const validateField = (field: string, ancestors: string[] = []) => {
    const parent = ancestors.reduce((obj, path) => obj[path], state?.master);
  };

  // %%%%%%%%%%%%%%\ VALIDATE FORM /%%%%%%%%%%%%%%

  const validateForm = () => {
    const validate = (source: object, ancestors: string[] = []) => {
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
              state?.data
            )[field];

            // console.log({ children: !!children });
            let nested;
            if (children) nested = validate(children, [...ancestors, field]);
            // ancestors.length && console.log({ field, VALUE });

            if (required && FAILS.includes(VALUE))
              return [field, "required field"];

            if (validation) {
              // console.log({ validation });
              if (Array.isArray(validation))
                for (const { validator, error } of validation) {
                  // console.log({ VALUE, isValid: validator(VALUE) });
                  if (!validator(VALUE, state?.data))
                    return [field, error ?? `Invalid ${capitalize(name)}`];
                }
              else {
                if (!validation(VALUE, state?.data))
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
    const result = validate(state?.master!);
    console.log({ result });
    // setFormMaster(prev => ({
    //   ...prev,
    //   validation: result,
    // }));
    dispatch({ type: "validate", payload: result });
  };

  // %%%%%%%%%%%%%%\ GET FIELD DATA /%%%%%%%%%%%%%%

  const getFieldData = (
    fields: FieldType[],
    ancestors: string[] = [] // TODO
  ): FieldsDataType => {
    type FieldDataOutput = Omit<FieldType, "field" | "confirm"> & {
      element: ReactElement | ReactElement[];
      aux?: Omit<FieldsDataType, "initialOutput"> & {
        values: object;
      };
      children?: FieldsDataType;
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
                  InputWrapper,
                  { ...element.props, key: element.key, group: true },
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

  const isSubmitted = () => state?.master?.submitted;

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
    useSummary,
    subForm = false,
    handleReset,
    handleCancel,
    handleSubmit,
    postMessage,
  }: FormAPIType & {
    useSummary?: {
      omit: string[];
    };
  }) => {
    const newForm: FormMasterType = getFieldData(expand(fields));

    // !formMaster &&
    //   setFormMaster({
    //     ...newForm,
    //     validation: undefined,
    //     errors: undefined,
    //     submitted: false,
    //   });
    // !state?.data && setFormData(newForm.initialOutput);
    !state && dispatch({ type: "init", payload: newForm });

    const purge = obj => {
      return Object.fromEntries(
        Object.entries(obj).filter(([field, data]) =>
          typeof data === "object" ? purge(data) : !state?.master?.[field].aux
        )
      );
    };

    const submitForm = (): void => {
      // console.log(`%cSUBMIT:`, "color:cyan", { state?.data });
      console.log(`%cSUBMIT:`, "color:cyan", { data: state?.data });
      // handleSubmit();
      if (validate) {
        // const { validated, errors } = state?.master!;
        const { errors } = state;

        if (errors) {
          if (!Object.keys(errors).length) {
            // setFormMaster(prev => ({ ...prev, submitted: true }));
            dispatch({ type: "submit" });
            handleSubmit();
          }
        } else {
          validateForm();
        }
      } else {
      }

      console.log(`%cSUBMITTED`, "color: lime");
      // setFormMaster(prev => ({ ...prev, submitted: true }));
      // TODO: IF VALIDATE, VALIDATE
    };

    const summarize = (data = state?.data!) => {
      const pruned = Object.fromEntries(
        Object.entries(data).filter(
          ([field]) => !useSummary!.omit.includes(field)
        )
      );

      // console.log({ data, pruned });

      return pruned;
    };

    return state?.submitted ? (
      <Markdown className={`post-submit-msg`} options={{ forceBlock: true }}>
        {postMessage?.(state?.data!) ?? "Submitted"}
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
        handleCancel={handleCancel}
        handleReset={() => {
          dispatch({ type: "reset" });
        }}
        submitTxt={submitTxt}
        resetTxt={resetTxt}
        // summary={useSummary && state?.data ? summarize() : undefined}
        summary={useSummary && state?.data ? summarize() : undefined}
        subForm={subForm}
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
    state: () => state?.data,
    isSubmitted,
    getValue,
    render: renderField,
    renderEach,
    process: getFieldData,
    ...INPUTS,
  };
}
