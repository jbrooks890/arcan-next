import "../../styles/Prompt.css";
import useModal from "../../hooks/useModal";
import FieldSet from "../form/FieldSet";
import Menu from "../form/Menu";
import { ReactElement } from "react";

type PromptOptionsType = { [key: string]: Function } | Map<string, Function>;

type PromptPropsType = {
  btnTxt: string;
  message: string | ReactElement;
  options: PromptOptionsType;
  cancelable?: boolean;
};

export default function Prompt({
  btnTxt,
  message,
  options,
  cancelable = true,
}: PromptPropsType) {
  const { toggle, close, modal } = useModal();

  const createDialogBox = () => {
    const optionsMapped = new Map(Object.entries(options));

    if (optionsMapped.size === 1 && cancelable)
      optionsMapped.set("cancel", close);

    const exec = (option: keyof PromptOptionsType): void => {
      optionsMapped.get(option)();
      close();
    };

    return (
      <div className="prompt wrapper col">
        <p className="prompt-query">{message}</p>
        <Menu
          options={[...optionsMapped.keys()]}
          handleChange={(option: keyof PromptOptionsType) => exec(option)}
          searchable={false}
        />
      </div>
    );
  };

  // console.log({ $MODAL: modal(createDialogBox()) });

  return (
    <>
      <button className="modal-btn" onClick={toggle}>
        {btnTxt}
      </button>
      {modal(createDialogBox())}
    </>
  );
}
