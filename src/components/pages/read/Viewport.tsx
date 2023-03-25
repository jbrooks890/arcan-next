import styles from "@/src/styles/reader/Viewport.module.css";

export default function Viewport({ content }: { content: string }) {
  return <div>{content ?? "No content"}</div>;
}
