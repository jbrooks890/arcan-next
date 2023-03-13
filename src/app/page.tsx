import styles from "../styles/Home.module.css";
import ARCAN_LOGO from "../../public/assets/images/arcan-logo.svg";
import Page from "@/components/layout/Page";

export default function Home() {
  return (
    <Page name="Home">
      <h1 className={`${styles["logo-main"]}`}>
        <ARCAN_LOGO />
      </h1>
      <h3>Welcome, newcomer.</h3>
    </Page>
  );
}
