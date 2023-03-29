"use client";
import styles from "@/styles/form/Criteria.module.scss";
import { MouseEventHandler, MutableRefObject, useRef } from "react";

export default function Criteria({
  content,
  show,
  toggle,
}: {
  content: string | string[];
  show: boolean;
  toggle: MouseEventHandler<HTMLDivElement>;
}) {
  const wrapper = useRef<HTMLDivElement | null>(null);
  const deduped = Array.isArray(content) && new Set(content);
  return (
    <div
      ref={wrapper}
      className={`${styles.criteria} criteria ${show ? "show" : "hide"}`}
      onClick={toggle}
      style={{
        maxHeight: show ? wrapper.current?.scrollHeight + "px" : 0,
      }}
    >
      {deduped ? (
        <ul className={`${styles.list} criteria-list`}>
          {[...deduped].map((criterium, i) => (
            <li key={i} className={`flex`}>
              {criterium}
            </li>
          ))}
        </ul>
      ) : (
        content
      )}
    </div>
  );
}
