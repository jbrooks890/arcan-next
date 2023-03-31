type InputPropsType = {
  field: string;
  value: any;
  placeholder?: string;
  handleChange: ChangeEventHandler<HTMLInputElement>;
};

type SelectType = {
  options: string[];
  display?: { [key: string]: string };
  field: string;
  value?: any | any[];
  other?: boolean;
  handleChange: Function;
};
