import ChoiceBox from "./ChoiceBox";
import Dropdown from "./Dropdown";
import Label from "./Label";
import TextField from "./TextField";

type PropsType = SelectType & {
  multi?: boolean;
  inline?: boolean;
  dropdown?: boolean;
};

export default function SelectMaster({
  dropdown = false,
  inline,
  multi,
  ...props
}: PropsType) {
  const {
    options,
    field,
    value = multi ? [] : undefined,
    other = false,
    handleChange,
  } = props;
  dropdown = !multi && options?.length > 4;
  const Selector = dropdown ? Dropdown : ChoiceBox;
  if (!dropdown) Object.assign(props, { inline, multi });
  // console.log({ field, options });

  const OUTPUT = <Selector {...props} />;

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
