import DBContextProvider from "@/components/contexts/DBContext";
import { fetchArcanData } from "@/lib/fetch";
import { ReactElement } from "react";

type Props = { children: ReactElement | ReactElement[] };
export default async function DBLayout({ children }: Props) {
  const arcanData = await fetchArcanData();

  return <DBContextProvider data={arcanData}>{children}</DBContextProvider>;
}
