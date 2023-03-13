export default function useNav() {
  const nav = {
    Home: "/",
    About: "/about",
    Read: "/read",
    Gallery: "/gallery",
    Lore: {
      $: "/lore",
      World: "/world",
      Characters: "/characters",
      Creatures: "/creatures",
      Magic: "/magic",
      Wiki: "/wiki",
    },
  };

  return { nav };
}
