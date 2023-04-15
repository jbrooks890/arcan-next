import { ReactElement, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "@/styles/Modal.module.scss";

// TUTORIAL: https://upmostly.com/tutorials/modal-components-react-custom-hooks

type ModalPropsType = {
  isShowing: boolean;
  auto: boolean;
  closeable: boolean;
  screen: boolean;
  children: ReactElement | ReactElement[];
} & Passthrough;

export default function Modal({
  isShowing,
  className,
  auto = false,
  closeable = true,
  screen = true,
  children,
}: ModalPropsType) {
  const [active, setActive] = useState(false);
  const wrapper = useRef<HTMLDivElement | null>(null);

  // console.log({ isShowing });
  // console.log({ children });
  useEffect(() => {
    if (isShowing) setActive(true);
  }, []);

  const closeModal = () => {
    document.body.classList.toggle("modal-lock");
    setActive(false);
  };

  return isShowing
    ? createPortal(
        <>
          <div className={`${styles.overlay} ${screen ? "screen" : "clear"}`} />
          <div
            className={`${styles.wrapper} flex col ${
              active ? "active" : "inactive"
            } ${className}`}
            ref={wrapper}
            aria-modal
            aria-hidden
            tabIndex={-1}
            role="dialog"
          >
            <div className={`${styles.modal} flex col center`}>
              {!auto && closeable && (
                <div
                  className={`${styles.close} flex center`}
                  data-dismiss="modal"
                  aria-label="close"
                  onClick={() => !auto && closeModal()}
                />
              )}
              {children}
            </div>
          </div>
        </>,
        document.body
      )
    : null;
}
