import styles from "@/styles/Calendar.module.scss";
import type { DatePkg } from "@/hooks/useDate";

type Props = {
  thisDate: DatePkg;
  isToday: boolean;
  isSelected: boolean;
  isPadding: boolean;
  handleSelect?: () => void;
} & Passthrough;

export default function Day({
  thisDate,
  isToday,
  isSelected,
  isPadding,
  handleSelect,
  className,
}: Props) {
  return (
    <div
      className={`${styles.day} ${isPadding ? "padding" : "day"} ${
        isToday ? "today" : "not-today"
      } ${isSelected ? "selected" : "not-selected"} flex center ${
        className ?? "exo"
      }`}
      data-date={thisDate.date}
      data-date-string={thisDate.strings.full}
      onClick={() => handleSelect?.()}
    />
  );
}
