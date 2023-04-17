type InputPropsType = {
  field: string;
  value: any;
  placeholder?: string;
  handleChange: ChangeEventHandler<HTMLInputElement>;
  min?: number | string | Date;
  max?: number | string | Date;
  step?: number;
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
  open?: boolean;
  inline?: boolean;
  children: ReactElement | ReactElement[];
};

type SelectType = {
  options: string[] | { [key: string]: string | number };
  // display?: { [key: string]: string };
  field: string;
  value?: any | any[];
  other?: boolean;
  handleChange: Function;
};

type Passthrough = {
  id?: string;
  className?: string;
  style?: object;
};
