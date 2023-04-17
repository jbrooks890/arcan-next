import useForm, { FieldTypeEnum } from "@/hooks/useForm";
import { useReducer } from "react";
import FieldSet from "../FieldSet";
import SelectMaster from "../SelectMaster";

type MixedStateType<T> = {
  fieldType: keyof typeof FieldTypeEnum;
  fieldKey: string;
  fieldValue: T;
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "update":
      break;
    case "delete":
      break;
    case "clear":
      break;
    default:
      return state;
  }
};

export default function Mixed({
  name,
  field,
  handleChange,
  value,
}: InputPropsType & InputWrapperType) {
  const [state, dispatch] = useReducer(reducer, {});
  const { text, select, render, field: formField, group } = useForm();

  const FIELD_TYPE = select("$fieldType*", Object.keys(FieldTypeEnum), false, {
    aux: true,
  });

  const FIELD_KEY = text("$fieldKey*");

  const FIELD_VALUE = formField({
    name: "field value",
    field: "fieldValue",
    type: state.fieldType,
    required: true,
  });

  const FIELD_GROUP = [FIELD_TYPE, FIELD_KEY, FIELD_VALUE];

  // const newEntry = group("$" + field, FIELD_GROUP);

  // return render(newEntry, [], { source: state, updater: dispatch });
  return (
    <div className={`${styles.wrapper}`}>
      <FieldSet name={name} field={field}>
        {FIELD_GROUP.map(FIELD => render(FIELD))}
      </FieldSet>
    </div>
  );
}
