export default function useNav() {
  const nav = {
    Home: "/",
    About: "/about",
    Read: {
      $: "/read",
      "The Immortal Curse": "/read",
      "The Missing Nexus": "/read",
      "The Vengeful Traitor": "/read",
    },
    Gallery: "/gallery",
    Lore: {
      $: "/lore",
      Characters: "/characters",
      World: "/world",
      Magic: "/magic",
    },
    "Sign In": "/login",
  };

  return { nav };
}
