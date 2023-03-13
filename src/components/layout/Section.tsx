import { makeHTMLSafe } from "@/lib/utility";
import { ReactNode } from "react";

type PropsType = {
  name: string;
  id?: string;
  children: ReactNode | ReactNode[];
};

export type SectionElement = JSX.Element;

export default function Section({
  name,
  id = makeHTMLSafe(name),
  children,
  ...props
}: PropsType): SectionElement {
  return (
    <section id={`${name}-section ${id}`} data-section-name={name} {...props}>
      {children}
    </section>
  );
}
