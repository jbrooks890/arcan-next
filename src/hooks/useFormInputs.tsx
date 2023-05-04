import { makeHTMLSafe } from "@/lib/utility";
import type { FieldType } from "./useForm";
import useForm from "./useForm";

export default function useFormInputs() {
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

  // <><><><><><><><>\ FIELD /<><><><><><><><>

  const field = ({
    name,
    field,
    type,
    value,
    required = false,
    confirm = false,
  }: FieldType): FieldType<typeof type> => {
    // value !== undefined && console.log({ field, value });
    return {
      name: name ?? labelize(field),
      field: field ?? makeHTMLSafe(name),
      type,
      value,
      required,
      confirm,
    };
  };

  // <><><><><><><><>\ TEXT /<><><><><><><><>

  const text = (
    label: string,
    block = false,
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
    options?: Partial<Omit<FieldType<number>, "type">>
  ): FieldType<number> => {
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
    options?: Partial<Omit<FieldType<number>, "type">>
  ): FieldType<number> => {
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
    options?: Partial<Omit<FieldType<Date>, "type">>
  ): FieldType<Date> => {
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
    options?: Partial<Omit<FieldType<boolean>, "type">>
  ): FieldType<boolean> => {
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

  const select = <T extends unknown = string>(
    label: string,
    choices: (T | object)[] | { [key: string]: T },
    multi = false,
    other = false,
    options?: Partial<Omit<FieldType<T>, "type" | "choices">>
  ): FieldType<typeof choices> => {
    const [name, field, required] = parseLabel(label);
    return {
      name,
      field,
      type: "select",
      required,
      choices,
      ...options,
      options: {
        ...options?.options,
        multi,
        other,
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

  // <><><><><><><><>\ ELEMENT /<><><><><><><><>
  const component = (
    label: string,
    component: NonNullable<FieldType["options"]>["Element"],
    type: FieldType["type"],
    params?: Partial<Omit<FieldType, "type">>
  ): FieldType => {
    const [name, field, required] = parseLabel(label);

    return {
      name,
      field,
      required,
      type,
      ...params,
      options: {
        Element: component!,
      },
    };
  };

  // <><><><><><><><>\ SYMBOL /<><><><><><><><>

  const symbol = () => {};

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

  return {
    field,
    text,
    number,
    float,
    password,
    email,
    date,
    boolean,
    select,
    group,
    component,
  };
}
