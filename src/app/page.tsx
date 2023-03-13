import styles from "@/styles/Home.module.css";
import Page from "@/components/layout/Page";
import Section from "@/components/layout/Section";
import ARCAN_LOGO from "../../public/assets/images/arcan-logo.svg";

export default function Home() {
  return (
    <Page name="Home">
      <h2 className={`${styles["logo-main"]} flex center`}>
        <ARCAN_LOGO />
      </h2>
      <Section name="Read" size="content">
        <ul className={`${styles["book-selector"]} flex`}>
          <li>The Immortal Curse</li>
          <li>The Missing Nexus</li>
          <li>The Vengeful Traitor</li>
        </ul>
      </Section>
      <Section name="Start Here">
        <h3>Start Here</h3>
        <p>Welcome, newcomer. Your adventure has only just begun.</p>
        <h4>
          The world of <em>Arcan</em> awaits you.
        </h4>
      </Section>
      <Section name="Lore">
        <ul>
          <li>World</li>
          <li>Characters</li>
          <li>Creatures</li>
          <li>Magic</li>
          <li>Wiki</li>
        </ul>
      </Section>
      <Section name="Feedback">
        <h3>Feedback</h3>
        <p>Feedback is crucial! Let us know what you think so far.</p>
      </Section>
      <Section name="Legacy">
        <h3>Are you a legacy reader?</h3>
        <p>
          Did you read the original <em>Arcan: The Missing Nexus (2016)</em>?
        </p>
        <button type="button">Button</button>
      </Section>
      <Section name="Connect">
        <h2>Connect</h2>
        <h3>Support Arcan on Patreon!</h3>
        <p>
          Your support keeps the engine running. Your contriubtion enables
          better content, including <strong>artwork</strong> and{" "}
          <strong>merch</strong>!
        </p>
        <h3>Subscribe</h3>
        <p>Be the first to know when new content lands!</p>
      </Section>
    </Page>
  );
}
