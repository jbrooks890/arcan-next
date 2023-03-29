import ChoiceBox from "./ChoiceBox";
import Dropdown from "./Dropdown";

type PropsType = {
  options: string[];
  display?: { [key: string]: string };
  field: string;
  fieldPath: string;
  required: boolean;
  single?: boolean;
  label: string;
  className: string;
  value?: any | any[];
  handleChange: Function;
};

export default function SelectMaster({
  options,
  display,
  field,
  fieldPath,
  required,
  single = true,
  label,
  className,
  value = [],
  handleChange,
  dropdown = false,
}: PropsType & { dropdown?: boolean }) {
  const Selector = dropdown ? Dropdown : ChoiceBox;

  return <Selector />;
}
