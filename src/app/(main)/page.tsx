import styles from "@/styles/Home.module.css";
import Page from "@/components/layout/Page";
import Section from "@/components/layout/Section";
import ARCAN_LOGO from "../../../public/assets/images/arcan-logo.svg";
import Questionnaire from "@/components/prompts/Questionnaire";
import StarRating from "@/components/form/StarRating";
import UserGate from "@/components/prompts/UserGate";

export default function Home() {
  return (
    <Page name="Home">
      <h2 className={`${styles["logo-main"]} flex center`}>
        <ARCAN_LOGO />
      </h2>
      {/* <Section name="Read" size="content">
        <ul className={`${styles["book-selector"]} flex`}>
          <li>The Immortal Curse</li>
          <li>The Missing Nexus</li>
          <li>The Vengeful Traitor</li>
        </ul>
      </Section> */}
      <Section name="Start Here">
        <h2>Start Here</h2>
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
          <li>Glossary</li>
        </ul>
      </Section>
      <Section name="Feedback">
        <h2>Feedback</h2>
        <p>Feedback is crucial! Let us know what you think so far.</p>
        <StarRating />
        <br />
        <Questionnaire />
        <UserGate loginMode={false} />
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
        <h3>Social Media</h3>
        <p>
          Enjoying the website? Be sure to share on your favorite platforms.
          And, of course, a <em>like</em> and a <em>follow</em> helps too. Thank
          you!
        </p>
      </Section>
    </Page>
  );
}
