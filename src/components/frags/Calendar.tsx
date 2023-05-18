import styles from "@/styles/Calendar.module.scss";
import { useReducer, useMemo, useState } from "react";

// ----------------------------------------------------------------------
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;
// ----------------------------------------------------------------------

type DatePkg = {
  fullDate: Date;
  year: number;
  month: number;
  date: number;
  day: number;
  firstDay: number;
  lastDate: number;
  strings: [keyof typeof MONTHS, keyof typeof DAYS];
};

type CalendarProps = { date?: string | number | Date; minimize?: boolean };

export default function Calendar({ date, minimize = false }: CalendarProps) {
  const createDateObj = ($date: string | number | Date): DatePkg => {
    const newDate = $date instanceof Date ? $date : new Date($date);
    if (!newDate)
      throw new Error(`${$date} cannot be rendered as a valid date.`);

    // console.log({ newDate });

    const year = newDate.getFullYear(),
      month = newDate.getMonth(),
      date = newDate.getDate(),
      day = newDate.getDay(),
      firstDay = new Date(year, month, 1).getDay(),
      lastDate = new Date(year, month + 1, 0).getDate(),
      strings = [MONTHS[month], DAYS[day]];

    return {
      fullDate: newDate,
      year,
      month,
      date,
      day,
      firstDay,
      lastDate,
      strings,
    };
  };

  const NOW = new Date();
  const [selected, setSelected] = useState(date ? new Date(date) : undefined);
  const [targetDate, setTargetDate] = useState(date ?? NOW);
  const target = useMemo(() => createDateObj(targetDate), [targetDate]);
  const dayAbbr = ["U", "M", "T", "W", "R", "F", "S"];
  const monthAbbr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // -------------\ PAD MONTH /-------------
  const padMonth = (start = true) => {
    const padding = [];
    let prevLastDate = new Date(target.year, target.month, 0).getDate();

    for (let i = target.firstDay; i > 0; i--) {
      padding.unshift(
        <div
          key={"p" + i}
          className={`${styles.padding} ${styles.day} flex center`}
          data-date={prevLastDate--}
        />
      );
    }

    return padding;
  };

  // -------------\ CREATE MONTH /-------------
  const createMonth = () => {
    const days = [];
    for (let i = 1; i <= target.lastDate; i++) {
      const isToday =
        target.year === NOW.getFullYear() &&
        target.month === NOW.getMonth() &&
        i === NOW.getDate();

      const thisDate = new Date(target.fullDate.setDate(i));
      // console.log({ thisDate });

      days.push(
        <div
          key={i}
          className={`${styles.day} ${
            isToday ? "today" : "not-today"
          } flex center`}
          data-date={i}
          onClick={() => setSelected(thisDate)}
        />
      );
    }

    return days;
  };

  // -------------\ SHIFT MONTH /-------------
  const shiftMonth = (fwd = true) =>
    setTargetDate(new Date(target.year, target.month + (fwd ? 1 : -1), 1));

  // ==================================================
  // ::::::::::::::::::::\ RENDER /::::::::::::::::::::
  // ==================================================
  return (
    <div
      className={`${styles.calendar} ${minimize ? styles.mini : "full"} grid`}
    >
      <div className={`${styles.head} flex middle`}>
        <button
          className={`${styles.prev} flex center jab`}
          onClick={e => {
            e.preventDefault();
            shiftMonth(false);
          }}
        />
        <h2 className={`${styles.month} flex col`} data-year={target.year}>
          {MONTHS[target.month]}
        </h2>
        <button
          className={`${styles.next} flex center jab`}
          onClick={e => {
            e.preventDefault();
            shiftMonth();
          }}
        />
      </div>
      {DAYS.map(day => (
        <div key={day} className={styles.header}>
          {day}
        </div>
      ))}
      {target.firstDay > 0 ? padMonth() : undefined}
      {createMonth()}
    </div>
  );
}
