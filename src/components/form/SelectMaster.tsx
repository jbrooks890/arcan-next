import { ChangeEvent, useEffect, useState } from "react";
import ChoiceBox from "./ChoiceBox";
import Dropdown from "./Dropdown";
import Label from "./Label";
import TextField from "./TextField";

type PropsType = SelectType &
  InputWrapperType & {
    multi?: boolean;
    inline?: boolean;
    dropdown?: boolean;
  };

export default function SelectMaster<Choices>({
  dropdown = false,
  inline,
  multi,
  name,
  ...props
}: PropsType) {
  const {
    options,
    required,
    field,
    value = multi ? [] : undefined,
    other = false,
    handleChange,
  } = props;

  const [otherMode, setOtherMode] = useState(false);

  useEffect(() => {
    setOtherMode(multi ? value.includes("other") : value === "other");
  }, [value]);

  dropdown = !multi && options?.length > 4;

  const Selector = dropdown ? Dropdown : ChoiceBox;

  if (!dropdown) Object.assign(props, { inline, multi });
  if (other) Object.assign(props, { handleOther: setOtherMode });

  // console.log({ field, options });
  const OUTPUT = <Selector {...props} />;

  return other ? (
    <>
      {OUTPUT}
      {other && (
        <Label
          name={`${name} (other)`}
          field={field}
          className={`select-other ${otherMode ? "active" : "inactive"}`}
        >
          <TextField
            field={field}
            value={""}
            handleChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange(e.target.value)
            }
          />
        </Label>
      )}
    </>
  ) : (
    OUTPUT
  );
}
