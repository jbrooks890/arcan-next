import styles from "@/styles/Header.module.css";
import Nav from "./Nav";

export default function Header() {
  return <header className={`${styles.header} flex center`}>{<Nav />}</header>;
}
