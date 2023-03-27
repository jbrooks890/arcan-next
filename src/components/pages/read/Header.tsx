import ProgressBar from "@/components/frags/ProgressBar";
import styles from "@/styles/reader/Header.module.scss";

type PropsType = {
  title: string;
  book: string;
  warning: boolean;
  version: number;
  wordCount: number | undefined;
};

export default function Header({
  title,
  book,
  warning,
  version,
  wordCount,
}: PropsType) {
  return (
    <div
      className={`${styles.header} reader__header ${
        version < 1 ? "beta" : "official"
      } ${warning ? "warning" : "no-warning"}`}
    >
      <h2 className={`${styles.title}`}>{title}</h2>
      {/* <h4 className={`${styles.book}`}>{book}</h4> */}
      {/* <p>{`${wordCount.toLocaleString("en-US")} words`}</p> */}
      <ProgressBar progress={99} />
    </div>
  );
}
