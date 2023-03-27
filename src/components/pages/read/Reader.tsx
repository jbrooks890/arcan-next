// "use client";
import styles from "@/styles/Reader.module.css";
import Contents from "./Contents";
import Header from "./Header";
import Viewport from "./Viewport";
import Page from "@/components/layout/Page";
import Settings from "@/components/frags/Settings";
import axios from "axios";

async function getStoryContent() {
  try {
    const res = await axios.get(
      "http://localhost:3005/api/Section/6413cd759d213b5e2ac9cbce/load/"
    );
    // console.log({ res });
    return res.data;
  } catch (err) {
    console.log(err);
  }

  // if (!res.ok) throw new Error("failed to fetch data");
  // console.log(res.json());
  // return res.json();
}

export default async function Reader() {
  // const contentData = getStoryContent();
  const content = await getStoryContent();
  // console.log({ content });

  const wordCount = content?.split(/\s+/).length;

  // console.log({ content });

  return (
    <Page name={"Reader"} className={`${styles.wrapper}`}>
      <div>
        <Header
          title="Turbulent Calm"
          book="Arcan: The Missing Nexus"
          warning={true}
          version={0.5}
          wordCount={wordCount ?? 0}
        />
        <Contents />
        <Viewport content={content} />
      </div>
    </Page>
  );
}
