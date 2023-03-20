import { useState } from "react";
import styles from "@/styles/SocialMediaCache.module.css";

type SM_Type = {
  platform: string;
  handle: string;
  link: string;
};

const data: SM_Type[] = [
  {
    platform: "LinkedIn",
    handle: "",
    link: "",
  },
  {
    platform: "Facebook",
    handle: "",
    link: "",
  },
  {
    platform: "GitHub",
    handle: "",
    link: "",
  },
  {
    platform: "Discord",
    handle: "",
    link: "",
  },
  {
    platform: "Reddit",
    handle: "",
    link: "",
  },
  {
    platform: "Twitter",
    handle: "",
    link: "",
  },
  {
    platform: "Instagram",
    handle: "",
    link: "",
  },
];

type PropsType = {
  id: string;
  className: string;
};

export default function SocialMediaCache({ id, className }: PropsType) {
  const [selected, setSelected] = useState<SM_Type>();
  return (
    <div id={id} className={`${styles.wrap} sm-cache-wrap`.concat(className)}>
      <div className={`${styles.cache} cache`}>
        <div className={`${styles.display} handler`}>
          {selected?.handle ?? "No Selection"}
        </div>
      </div>
    </div>
  );
}
