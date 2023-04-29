import "../globals.scss";
import Layout from "@/components/shared/Layout";

export const metadata = {
  title: "Arcan",
  description: "Official website of the Arcan series by Julian Brooks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
