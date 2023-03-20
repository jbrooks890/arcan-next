import styles from "@/styles/Reader.module.css";
import Contents from "./Contents";
import Header from "./Header";
import Viewport from "./Viewport";
import Page from "@/components/layout/Page";
import Settings from "@/components/frags/Settings";

export default function Reader() {
  return (
    <Page name={"Reader"} className={`${styles.wrapper}`}>
      <div>
        <Header title="Turbulent Calm" warning={true} version={0.5} />
        <Contents />
        <Viewport />
      </div>
    </Page>
  );
}
