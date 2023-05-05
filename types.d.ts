// import { ChangeEventHandler } from "react";

type InputPropsType = {
  field: string;
  value: any;
  placeholder?: string;
  handleChange: ChangeEventHandler<HTMLInputElement>;
  min?: number | string | Date;
  max?: number | string | Date;
  step?: number;
  wrapper?: InputWrapperType;
};

type InputWrapperType = {
  name: string;
  field: string;
  required?: boolean;
  criteria?: string | string[];
  validated?: boolean;
  error?: string;
  id?: string;
  className?: string;
  group?: boolean;
  open?: boolean;
  inline?: boolean;
  children?: ReactElement | ReactElement[];
};

type SelectType<Options = [Options]> = {
  options: string[] | { [key: string]: string | number };
  // display?: { [key: string]: string };
  field: string;
  value?: Options | Options[];
  other?: boolean;
  handleChange: ChangeEventHandler;
  handleOther?: Function;
  wrapper?: InputWrapperType;
};

type Passthrough = {
  id?: string;
  className?: string;
  style?: object;
};
