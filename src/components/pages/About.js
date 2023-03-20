import Section from "@/components/layout/Section.tsx";
import Page from "@/components/layout/Page.tsx";

export default function About() {
  return (
    <Page name="About">
      <Section name="website">
        {
          "Arcan.com is the companion website to the Arcan series by Julian Brooks."
        }
      </Section>
    </Page>
  );
}
