import styles from "@/styles/Calendar.module.scss";
import type { DatePkg } from "./Calendar";

type Props = {
  thisDate: DatePkg;
  isToday: boolean;
  isSelected: boolean;
  handleSelect?: () => void;
} & Passthrough;

export default function Day({
  thisDate,
  isToday,
  isSelected,
  handleSelect,
  className,
}: Props) {
  return (
    <div
      className={`${styles.day} ${isToday ? "today" : "not-today"} ${
        isSelected ? "selected" : "not-selected"
      } flex center ${className ?? "exo"}`}
      data-date={thisDate.date}
      data-date-string={thisDate.dateString}
      onClick={() => handleSelect?.()}
    />
  );
}
