import { ChangeEvent, useEffect, useState, useRef, createElement } from "react";
import ChoiceBox from "./ChoiceBox";
import Dropdown from "./Dropdown";
import Input from "./Input";
import Label from "./Label";
import TextField from "./TextField";

type PropsType = InputWrapperType & {
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
}: PropsType & SelectType<Choices>) {
  const {
    options,
    required,
    field,
    value = multi ? [] : undefined,
    other = false,
    handleChange,
  } = props;

  const [otherMode, setOtherMode] = useState(false);
  const otherRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    otherMode && handleChange(otherRef.current!.value);
  }, [otherMode]);

  dropdown = !multi && options?.length > 4;

  const Selector = dropdown ? Dropdown : ChoiceBox;

  if (!dropdown) Object.assign(props, { inline, multi });
  if (other) Object.assign(props, { handleOther: setOtherMode });

  // console.log({ field, options });
  const OUTPUT = <Selector {...props} />;
  const otherLabelProps = {
    name: `${name} (other)`,
    field,
    className: `select-other ${otherMode ? "active" : "inactive"}`,
    children: [],
  };

  useEffect(() => {
    console.log({ OTHER: otherRef.current });
  }, [otherRef.current]);

  return other ? (
    <>
      {OUTPUT}
      {other && (
        <Input
          ref={otherRef}
          type={"string"}
          field={field}
          value={""}
          handleChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange(e.target.value)
          }
          Wrapper={[Label, otherLabelProps]}
        />
      )}
    </>
  ) : (
    OUTPUT
  );
}
