import styles from "@/styles/ProgressBar.module.scss";
import { CSSProperties } from "react";
import SEPARATOR from "../../../public/assets/svg/arcan-separator.svg";

interface CustomCSSVar extends CSSProperties {
  "--progress": string;
}

export default function ProgressBar({
  progress,
  className,
}: {
  progress: number;
  className?: string;
}) {
  return (
    <SEPARATOR />
    // <div
    //   className={`${styles.outer} progress-bar outer ${
    //     progress >= 100 ? "complete" : "in-progress"
    //   } ${className ?? ""}`}
    //   data-progress-txt={progress >= 100 ? "Complete" : `${progress}%`}
    //   style={{ ["--progress"]: `${progress}px` } as CustomCSSVar}
    // >
    //   <div className={`${styles.inner}`} data-progress={progress} />
    // </div>
  );
}
