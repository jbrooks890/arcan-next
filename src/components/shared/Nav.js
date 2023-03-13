"use client";
import styles from "../../styles/Nav.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useNav from "@/hooks/useNav";

export default function Nav() {
  const pathname = usePathname();
  const { nav } = useNav();

  const renderNav = () => {
    return Object.entries(nav).map(([display, target], i) => {
      return (
        <Link
          key={i}
          href={typeof target === "object" ? target.$ : target}
          className={
            target === pathname || target.$ === pathname ? "active" : undefined
          }
        >
          {display}
        </Link>
      );
    });
  };

  return (
    <nav className={`${styles.nav} flex`}>
      {[...renderNav(), <a>Sign In</a>]}
    </nav>
  );
}
