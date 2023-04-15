import { ReactNode } from "react";
import { makeHTMLSafe } from "@/lib/utility";
import type { SectionElement } from "./Section";
import styles from "@/styles/Page.module.scss";

type PropsType = {
  name: string;
  children: SectionElement | SectionElement[];
  type?: "regular" | "screen";
  dir?: string;
  banner?: string;
  theme?: string;
} & Passthrough;

export default function Page({
  name,
  id = makeHTMLSafe(name),
  className,
  type = "regular",
  dir,
  banner,
  children,
  ...props
}: PropsType) {
  return (
    <div
      id={`${id}-page ${id ?? ""}`}
      className={`${styles.page} page ${type}-type flex col middle ${
        className ?? "exo"
      }`}
      data-page-name={name}
      {...props}
    >
      {children}
    </div>
  );
}
