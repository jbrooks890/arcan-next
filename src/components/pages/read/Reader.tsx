// "use client";
import styles from "@/styles/Reader.module.css";
import Contents from "./Contents";
import Header from "./Header";
import Viewport from "./Viewport";
import Page from "@/components/layout/Page";
import Settings from "@/components/frags/Settings";
import axios from "axios";

async function getStoryContent() {
  const res = await fetch(
    "http://localhost:3005/api/Section/6413cd759d213b5e2ac9cbcf/load"
  );

  if (!res.ok) throw new Error("failed to fetch data");
  // console.log(res.json());
  return res.json();
}

export default async function Reader() {
  const contentData = getStoryContent();
  const content = await contentData;

  // console.log({ content });

  return (
    <Page name={"Reader"} className={`${styles.wrapper}`}>
      <div>
        <Header
          title="Turbulent Calm"
          book="Arcan: The Missing Nexus"
          warning={true}
          version={0.5}
        />
        <Contents />
        <Viewport content={JSON.stringify(content)} />
      </div>
    </Page>
  );
}
