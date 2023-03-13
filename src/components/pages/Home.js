import "../../styles/Home.css";
import ARCAN_LOGO from "../../public/assets/images/arcan-logo.svg";

export default function Home() {
  return (
    <Page name="Home">
      <h1 className={`${styles["logo-main"]}`}>
        <ARCAN_LOGO />
      </h1>
    </Page>
  );
}
