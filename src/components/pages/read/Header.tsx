import ProgressBar from "@/components/frags/ProgressBar";
import styles from "@/styles/reader/Header.module.scss";

type PropsType = {
  title: string;
  warning: boolean;
  version: number;
};

export default function Header({ title, warning, version }: PropsType) {
  return (
    <div
      className={`${styles.header} reader__header ${
        version < 1 ? "beta" : "official"
      } ${warning ? "warning" : "no-warning"}`}
    >
      <h2 className={`${styles.title}`}>{title}</h2>
      <ProgressBar progress={99} />
    </div>
  );
}
