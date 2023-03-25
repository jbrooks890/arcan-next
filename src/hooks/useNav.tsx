export default function useNav() {
  const nav = {
    Home: "/",
    Read: {
      $: "/read",
      "The Immortal Curse": "/read",
      "The Missing Nexus": "/read",
      "The Vengeful Traitor": "/read",
    },
    Lore: {
      $: "/lore",
      Characters: "/characters",
      World: "/world",
      Magic: "/magic",
    },
    Gallery: "/gallery",
    About: "/about",
    "Sign In": "/login",
  };

  return { nav };
}
