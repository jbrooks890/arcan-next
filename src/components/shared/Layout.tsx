import { ReactElement, ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

type ChildrenType = {
  children: ReactNode | ReactNode[];
};

export default function Layout({ children }: ChildrenType) {
  return (
    <div id="siteWrapper" className="flex col middle">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
