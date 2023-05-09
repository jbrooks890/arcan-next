import "../../globals.scss";
import DBContextProvider from "@/components/contexts/DBContext";
import { fetchArcanData } from "@/lib/fetch";
import { ReactElement } from "react";
import Layout from "@/components/shared/Layout";
import DBDraftProvider from "@/components/contexts/DBDraftContext";

type Props = { children: ReactElement | ReactElement[] };

export const metadata = {
  title: "Arcan",
  description: "Official website of the Arcan series by Julian Brooks",
};

export default async function DBLayout({ children }: Props) {
  const arcanData = await fetchArcanData();

  return (
    <html>
      <body>
        <DBContextProvider data={arcanData}>
          <DBDraftProvider>
            <Layout>{children}</Layout>
          </DBDraftProvider>
        </DBContextProvider>
      </body>
    </html>
  );
}
