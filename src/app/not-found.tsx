"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const { back } = useRouter();

  return (
    <main id="notFound-page">
      <h1>404</h1>
      <h2>Not Found</h2>
      <p>
        You appear to have had a misadventure and have wandered into a region
        beyond the map.
      </p>
      <a onClick={back}>Back</a>
      <Link href="/" replace>
        Home
      </Link>
    </main>
  );
}
