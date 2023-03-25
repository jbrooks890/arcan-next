import { ReactNode } from "react";
import { makeHTMLSafe } from "@/lib/utility";
import type { SectionElement } from "./Section";

type PropsType = {
  name: string;
  children: SectionElement | SectionElement[];
  id?: string;
  className?: string;
  type?: string;
  dir?: string;
  banner?: string;
  theme?: string;
};

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
      className={`page flex col middle ${className ?? ""}`}
      data-page-name={name}
      {...props}
    >
      {children}
    </div>
  );
}
