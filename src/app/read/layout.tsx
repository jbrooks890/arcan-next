// import "./globals.css";
import Layout from "@/components/shared/Layout";
import Reader from "@/components/pages/read/Reader";

export const metadata = {
  title: "Read | Arcan",
  description: "Official website of the Arcan series by Julian Brooks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Reader />;
}
