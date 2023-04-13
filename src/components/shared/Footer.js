import styles from "@/styles/Footer.module.css";
import Copy from "../frags/Copy";
import Icons from "./Icons";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Copy />
      <Icons />
    </footer>
  );
}
