import styles from "@/styles/Section.module.scss";
import { makeHTMLSafe } from "@/lib/utility";
import { ReactNode } from "react";

type PropsType = {
  name: string;
  id?: string;
  className?: string;
  banner?: HTMLImageElement | ImageData | string;
  size?: "frame" | "max" | "content";
  children: ReactNode | ReactNode[];
};

export type SectionElement = JSX.Element;

export default function Section({
  name,
  id = makeHTMLSafe(name),
  className,
  banner,
  size = "frame",
  children,
  ...props
}: PropsType): SectionElement {
  return (
    <section
      id={`${name}-section ${id}`}
      data-section-name={name}
      className={`${styles.section} ${size}-width ${
        banner ? "has-banner" : "no-banner"
      } ${className ?? ""}`}
      {...props}
    >
      {children}
    </section>
  );
}
