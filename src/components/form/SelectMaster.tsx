import ChoiceBox from "./ChoiceBox";
import Dropdown from "./Dropdown";
import Label from "./Label";
import TextField from "./TextField";

type PropsType = {
  options: string[];
  display?: { [key: string]: string };
  field: string;
  multi?: boolean;
  inline?: boolean;
  value?: any | any[];
  other?: boolean;
  handleChange: Function;
};

export default function SelectMaster({
  dropdown = false,
  inline,
  multi,
  ...props
}: PropsType & { dropdown?: boolean }) {
  const {
    options,
    field,
    value = multi ? [] : undefined,
    other = false,
    handleChange,
  } = props;
  const Selector = dropdown ? Dropdown : ChoiceBox;

  const OUTPUT = (
    <Selector
      {...props}
      inline={(!dropdown && inline) ?? false}
      multi={(!dropdown && multi) ?? false}
    />
  );

  return other ? (
    <>
      {OUTPUT}
      <Label name="other" field={`${field}-other`}>
        <TextField
          field={field}
          value={""}
          handleChange={e => handleChange(e.target.value)}
        />
      </Label>
    </>
  ) : (
    OUTPUT
  );
}
