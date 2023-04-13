import DBContextProvider from "@/components/contexts/DBContext";
import Page from "@/components/layout/Page";
import Section from "@/components/layout/Section";
import { fetchArcanData } from "@/lib/fetch";

export default async function Admin() {
  const arcanData = await fetchArcanData();

  return (
    <Page name="Admin">
      <DBContextProvider data={arcanData}>
        <Section name="header">Admin</Section>
      </DBContextProvider>
    </Page>
  );
}
