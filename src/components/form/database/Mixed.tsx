import useForm, { FieldType, FieldTypeEnum } from "@/hooks/useForm";
import { useReducer } from "react";
import InputWrapper from "../InputWrapper";

// type State<T> = {
//   fieldType: FieldType["type"];
//   fieldKey: string | undefined;
//   fieldValue: T | undefined;
// } & InputPropsType;

// const initialState: State<string> = {
//   fieldType: "string",
//   fieldKey: undefined,
//   fieldValue: undefined,
// };

// const reducer = (state: State, action) => {
//   const { type, payload } = action;
//   switch (type) {
//     case "update":
//       break;
//     case "reset":
//       return initialState;
//     default:
//       return state;
//   }
// };

// ===============================================
// :::::::::::::::::| COMPONENT |:::::::::::::::::
// ===============================================

export default function Mixed({
  field,
  handleChange,
  value,
  wrapper,
}: InputPropsType) {
  // const [state, dispatch] = useReducer(reducer, initialState);
  const { text, select, field: formField, form, state } = useForm();

  // console.log({ state: state() });

  // ---------------< METHODS >---------------

  const addEntry = () => {
    // const { fieldKey, fieldValue } = state;
    handleChange({ ...value, [state.fieldKey]: state.fieldValue });
  };

  const deleteEntry = target => {
    handleChange(value.filter(entry => entry !== target));
  };

  // ---------------< FIELDS >---------------

  const simpleFields = "string number float boolean email".split(" ");

  const FIELD_TYPE = select("$fieldType*", simpleFields, false, false, {
    aux: true,
  });

  const FIELD_KEY = text("$fieldKey*");

  const FIELD_VALUE = formField({
    name: "field value",
    field: "fieldValue",
    type: state()?.fieldType ?? "string",
    required: true,
  });

  const FIELD_GROUP = [FIELD_TYPE, FIELD_KEY, FIELD_VALUE];

  const newEntry = form({
    name: `New ${wrapper?.name} entry`,
    fields: FIELD_GROUP,
    subForm: true,
    submitTxt: "Add",
    resetTxt: "Clear",
    handleSubmit: addEntry,
    // handleCancel: cancel,
  });

  return wrapper ? (
    <InputWrapper {...wrapper}>{newEntry}</InputWrapper>
  ) : (
    newEntry
  );
}
