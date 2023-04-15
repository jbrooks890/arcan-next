// import "../../styles/form/Search.css";
import SEARCH_ICON from "../../../public/assets/svg/search-icon.svg";
import styles from "@/styles/form/Search.module.scss";

type PropsType = {
  handleChange?: Function;
  [key: string]: any;
};

export default function Search({
  handleChange,
  className,
  ...props
}: PropsType) {
  return (
    <div
      className={`${styles.search} flex middle ${className ?? "exo"}`}
      {...props}
    >
      <div className={`${styles.icon} flex middle`}>
        <SEARCH_ICON />
      </div>
      <input placeholder="Search" size={1} />
    </div>
  );
}
