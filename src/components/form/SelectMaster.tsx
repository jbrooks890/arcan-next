import {
  ChangeEvent,
  useEffect,
  useState,
  useRef,
  createElement,
  useReducer,
} from "react";
import ChoiceBox from "./ChoiceBox";
import Dropdown from "./Dropdown";
import Input from "./Input";
import InputWrapper from "./InputWrapper";
import Label from "./Label";
import TextField from "./TextField";

type PropsType = {
  multi?: boolean;
  inline?: boolean;
  dropdown?: boolean;
  wrapper: InputWrapperType;
};

export default function SelectMaster<Choices>({
  dropdown = false,
  inline,
  multi,
  wrapper,
  ...props
}: PropsType & SelectType<Choices>) {
  const {
    options,
    field,
    value = multi ? [] : undefined,
    other = false,
    handleChange,
  } = props;

  const defaultOther = {
    active: false,
    value: "",
  };

  type Action =
    | { type: "update"; payload: string }
    | { type: "switch"; payload: boolean }
    | { type: "toggle"; payload: undefined };

  const reducer = (state: typeof defaultOther, action: Action) => {
    const { type, payload } = action;
    switch (type) {
      case "switch":
        return { ...state, active: payload };
      case "toggle":
        return {
          ...state,
          active: !state.active,
        };
      case "update":
        return {
          ...state,
          value: payload,
        };
    }
  };

  const [$other, dispatch] = useReducer(reducer, defaultOther);
  const [otherMode, setOtherMode] = useState(false);
  const otherRef = useRef<HTMLInputElement | null>(null);
  const { name, required } = wrapper;

  useEffect(() => {
    otherMode && handleChange(otherRef.current!.value);
  }, [otherMode]);

  dropdown = !multi && options?.length > 3;

  const Selector = dropdown ? Dropdown : ChoiceBox;

  if (!dropdown) Object.assign(props, { inline, multi });
  if (other) Object.assign(props, { handleOther: setOtherMode });

  // console.log({ field, options });
  const OUTPUT = (
    <InputWrapper {...wrapper}>
      <Selector {...props} />
    </InputWrapper>
  );
  const otherLabelProps: InputWrapperType = {
    name: `${name} (other)`,
    field,
    className: `select-other ${otherMode ? "active" : "inactive"}`,
    children: [],
  };

  return other ? (
    <>
      {OUTPUT}
      {other && (
        <Input
          ref={otherRef}
          type={"string"}
          field={field}
          value={otherMode ? value : ""}
          handleChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange(e.target.value)
          }
          wrapper={otherLabelProps}
        />
      )}
    </>
  ) : (
    OUTPUT
  );
}
