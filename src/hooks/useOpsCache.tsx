import ButtonCache from "@/components/form/ButtonCache";
import { MouseEventHandler } from "react";

export default function useOpsCache() {
  const createButtons = (buttons: {
    [key: string]: MouseEventHandler<HTMLButtonElement>;
  }) => {
    return (
      <ButtonCache>
        {Object.entries(buttons).map(([btnTxt, btnFn], i) => (
          <button key={i} onClick={btnFn}>
            {btnTxt}
          </button>
        ))}
      </ButtonCache>
    );
  };
  return { createButtons };
}
