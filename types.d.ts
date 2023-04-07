type InputPropsType = {
  field: string;
  value: any;
  placeholder?: string;
  handleChange: ChangeEventHandler<HTMLInputElement>;
};

type InputWrapperType = {
  name: string;
  field: string;
  required?: boolean;
  criteria?: string | string[];
  error?: string;
  id?: string;
  className?: string;
  open?: boolean;
  children: ReactElement | ReactElement[];
};

type SelectType = {
  options: string[];
  display?: { [key: string]: string };
  field: string;
  value?: any | any[];
  other?: boolean;
  handleChange: Function;
};
