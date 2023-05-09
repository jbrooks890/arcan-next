import styles from "@/styles/Prompt.module.scss";
import useModal from "../../hooks/useModal";
import FieldSet from "../form/FieldSet";
import Menu from "../form/Menu";
import { ReactElement } from "react";
import Markdown from "markdown-to-jsx";

type PromptOptionsType = { [key: string]: Function } | Map<string, Function>;

type PromptPropsType = {
  btnTxt: string;
  message: string;
  options: PromptOptionsType;
  cancelable?: boolean;
  className?: string;
};

export default function Prompt({
  btnTxt,
  message,
  options,
  cancelable = true,
  className,
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
      <div className={`${styles.prompt} wrapper col`}>
        <p className={styles.query}>
          <Markdown>{message}</Markdown>
        </p>
        <Menu
          options={[...optionsMapped.keys()]}
          handleChange={(option: keyof PromptOptionsType) => exec(option)}
          searchable={false}
          className={styles.menu}
        />
      </div>
    );
  };

  // console.log({ $MODAL: modal(createDialogBox()) });

  return (
    <>
      <button className={`modal-btn ${className ?? "exo"}`} onClick={toggle}>
        {btnTxt}
      </button>
      {modal(createDialogBox())}
    </>
  );
}
