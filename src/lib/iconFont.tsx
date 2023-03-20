type fontMapType = {
  [key: string]: {
    type: ("platform" | "application" | "library")[];
    char: string;
    alt: string[];
  };
};

export const fontMap: fontMapType = {
  LinkedIn: {
    alt: [],
    type: ["platform"],
    char: "!",
  },
  Autodesk: {
    alt: [],
    type: ["application"],
    char: '"',
  },
  _Instagram: {
    alt: [],
    type: ["platform"],
    char: "#",
  },
  _Twitter: {
    alt: [],
    type: ["platform"],
    char: "$",
  },
  _YouTube: {
    alt: [],
    type: ["platform"],
    char: "%",
  },
  _Snapchat: {
    alt: [],
    type: ["platform"],
    char: "&",
  },
  Shopify: {
    alt: [],
    type: ["platform"],
    char: "'",
  },
  _Pinterest: {
    alt: [],
    type: ["platform"],
    char: "(",
  },
  _GitHub: {
    alt: [],
    type: ["platform"],
    char: ")",
  },
  _Reddit: {
    alt: [],
    type: ["platform"],
    char: "*",
  },
  "Adobe XD": {
    alt: ["XD"],
    type: ["application"],
    char: "+",
  },
  _Windows: {
    alt: [],
    type: ["application"],
    char: ",",
  },
  Photoshop: {
    alt: ["Adobe Photoshop"],
    type: [],
    char: "-",
  },
  Android: {
    alt: [],
    type: ["application"],
    char: ".",
  },
  Steam: {
    alt: [],
    type: ["platform"],
    char: "/",
  },
  _LinkedIn: {
    alt: [],
    type: ["platform"],
    char: "0",
  },
  Facebook: {
    alt: [],
    type: ["platform"],
    char: "1",
  },
  Instagram: {
    alt: [],
    type: ["platform"],
    char: "2",
  },
  Twitter: {
    alt: [],
    type: ["platform"],
    char: "3",
  },
  YouTube: {
    alt: [],
    type: ["platform"],
    char: "4",
  },
  Tumblr: {
    alt: [],
    type: ["platform"],
    char: "5",
  },
  Snapchat: {
    alt: [],
    type: ["platform"],
    char: "6",
  },
  Reddit: {
    alt: [],
    type: ["platform"],
    char: "7",
  },
  Pinterest: {
    alt: [],
    type: ["platform"],
    char: "8",
  },
  GitHub: {
    alt: [],
    type: ["platform"],
    char: "9",
  },
  Acrobat: {
    alt: ["Adobe Acrobat"],
    type: [],
    char: ":",
  },
  "?": {
    alt: [],
    type: [],
    char: ";",
  },
  Linux: {
    alt: [],
    type: ["application"],
    char: "<",
  },
  Illustrator: {
    alt: ["Adobe Illustrator"],
    type: [],
    char: "=",
  },
  Dribbble: {
    alt: [],
    type: ["platform"],
    char: ">",
  },
  Kickstarter: {
    alt: [],
    type: ["platform"],
    char: "?",
  },
  _Facebook: {
    alt: [],
    type: ["platform"],
    char: "@",
  },
  Angular: {
    alt: [],
    type: ["library"],
    char: "A",
  },
  _Postman: {
    alt: [],
    type: ["application"],
    char: "B",
  },
  CSS: {
    alt: [],
    type: ["library"],
    char: "C",
  },
  "Node.js": {
    alt: [],
    type: ["library"],
    char: "D",
  },
  SASS: {
    alt: [],
    type: ["library"],
    char: "E",
  },
  MySQL: {
    alt: [],
    type: ["library"],
    char: "F",
  },
  _Git: {
    alt: [],
    type: ["application"],
    char: "G",
  },
  HTML: {
    alt: [],
    type: ["library"],
    char: "H",
  },
  Postman: {
    alt: [],
    type: ["application"],
    char: "I",
  },
  JavaScript: {
    alt: [],
    type: ["library"],
    char: "J",
  },
  GitHub2: {
    //TODO: FIX
    alt: [],
    type: ["platform"],
    char: "K",
  },
  LESS: {
    alt: [],
    type: ["library"],
    char: "L",
  },
  MongoDB: {
    alt: [],
    type: ["application"],
    char: "M",
  },
  NPM: {
    alt: ["Node Package Manager"],
    type: [],
    char: "N",
  },
  Outlook: {
    alt: [],
    type: ["application"],
    char: "O",
  },
  PHP: {
    alt: [],
    type: [],
    char: "P",
  },
  jQuery: {
    alt: [],
    type: ["library"],
    char: "Q",
  }, // TODO
  React: {
    alt: [],
    type: ["library"],
    char: "R",
  },
  Swift: {
    alt: [],
    type: ["library"],
    char: "S",
  },
  "_Node.js": {
    alt: [],
    type: ["library"],
    char: "T",
  },
  Unity: {
    alt: [],
    type: ["application"],
    char: "U",
  },
  Java: {
    alt: [],
    type: ["library"],
    char: "V",
  },
  AWS: {
    alt: ["Amazon Web Services"],
    type: ["platform"],
    char: "W",
  },
  Azure: {
    alt: ["Microsoft Azure"],
    type: ["platform"],
    char: "X",
  },
  "C#": {
    alt: [],
    type: ["library"],
    char: "Y",
  },
  ZBrush: {
    alt: [],
    type: ["application"],
    char: "Z",
  },
  "Visual Studio": {
    alt: [],
    type: ["application"],
    char: "[",
  },
  "Visual Studio Code": {
    alt: [],
    type: ["application"],
    char: "]",
  },
  _Tumblr: {
    alt: [],
    type: ["platform"],
    char: "^",
  },
  InDesign: {
    alt: [],
    type: ["application"],
    char: "_",
  },
  Apple: {
    alt: [],
    type: ["application"],
    char: "a",
  },
  ArtStation: {
    alt: [],
    type: ["platform"],
    char: "b",
  },
  _CSS: {
    alt: [],
    type: ["library"],
    char: "c",
  },
  Discord: {
    alt: [],
    type: ["platform"],
    char: "d",
  },
  Figma: {
    alt: [],
    type: ["platform"],
    char: "e",
  },
  _MySQL: {
    alt: [],
    type: [],
    char: "f",
  },
  Git: {
    alt: [],
    type: ["platform", "application"],
    char: "g",
  },
  Messenger: {
    alt: ["Facebook Messenger"],
    type: ["platform"],
    char: "h",
  },
  Dropbox: {
    alt: [],
    type: ["platform"],
    char: "i",
  },
  Typescript: {
    alt: [],
    type: ["library"],
    char: "j",
  },
  Skype: {
    alt: [],
    type: ["application"],
    char: "k",
  },
  "Stack Overflow": {
    alt: [],
    type: ["platform"],
    char: "l",
  },
  Meetup: {
    alt: [],
    type: ["platform"],
    char: "m",
  },
  Netlify: {
    alt: [],
    type: ["platform"],
    char: "n",
  },
  Google: {
    alt: [],
    type: ["application"],
    char: "o",
  },
  Patreon: {
    alt: [],
    type: ["platform"],
    char: "p",
  },
  _jQuery: {
    alt: [],
    type: ["library"],
    char: "q",
  },
  Mailchimp: {
    alt: [],
    type: ["platform"],
    char: "r",
  },
  Squarespace: {
    alt: [],
    type: ["platform"],
    char: "s",
  },
  TikTok: {
    alt: [],
    type: ["platform"],
    char: "t",
  },
  "Creative Cloud": {
    alt: ["Adobe Creative Cloud"],
    type: ["platform", "application"],
    char: "u",
  },
  Amazon: {
    alt: [],
    type: ["platform"],
    char: "v",
  },
  Wix: {
    alt: [],
    type: ["platform"],
    char: "w",
  },
  Meta: {
    alt: [],
    type: ["platform"],
    char: "x",
  },
  Windows: {
    alt: [],
    type: ["application"],
    char: "y",
  },
  Twitch: {
    alt: [],
    type: ["platform"],
    char: "z",
  },
  Python: {
    alt: [],
    type: ["library"],
    char: "|",
  },
  Edge: {
    alt: [],
    type: ["application"],
    char: "à",
  },
  _Heroku: {
    alt: [],
    type: ["platform"],
    char: "â",
  },
  "Next.js": {
    alt: [],
    type: ["library"],
    char: "ã",
  },
  $Heroku: {
    alt: [],
    type: ["platform"],
    char: "ä",
  },
  Safari: {
    alt: [],
    type: ["application"],
    char: "å",
  },
  Chrome: {
    alt: [],
    type: ["application"],
    char: "ç",
  },
  Heroku: {
    alt: [],
    type: ["platform"],
    char: "é",
  },
  _Firefox: {
    alt: [],
    type: ["application"],
    char: "ê",
  },
  Firefox: {
    alt: [],
    type: ["application"],
    char: "ë",
  },
};

export const getIcon = (
  icon: keyof fontMapType,
  alt = false
): string | undefined => {
  return (
    fontMap[icon].char ??
    Object.values(fontMap).find(({ alt }) =>
      alt.includes(alt ? (`_${icon}` as string) : (icon as string))
    )?.char
  );
};
