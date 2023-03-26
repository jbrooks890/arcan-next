"use client";
import styles from "@/styles/reader/Viewport.module.scss";
import Markdown from "markdown-to-jsx";
import { MutableRefObject, useEffect, useRef } from "react";

export default function Viewport({ content }: { content: string }) {
  // console.log({ parsed: JSON.parse(content) });
  const viewport = useRef<MutableRefObject<HTMLDivElement>>();

  return (
    <div className={styles.viewport}>
      {content ? (
        <Markdown options={{ forceBlock: true }}>{content}</Markdown>
      ) : (
        "No content"
      )}
      <button onClick={() => {}}>Top</button>
    </div>
  );
}
