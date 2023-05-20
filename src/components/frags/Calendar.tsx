import useDate from "@/hooks/useDate";
import styles from "@/styles/Calendar.module.scss";
import { useReducer, useMemo, useState } from "react";
import Day from "./Day";

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

type CalendarProps = {
  value: Date;
  date?: string | number | Date;
  minimize?: boolean;
  min?: string | number | Date;
  max?: string | number | Date;
  handleChange?: () => void;
};

export default function Calendar({
  date,
  minimize = false,
  value,
  min,
  max,
  handleChange,
}: CalendarProps) {
  const { unpackDate: unpack, makeDate, TODAY } = useDate();
  // const createDateObj = ($date: string | number | Date): DatePkg => {
  //   const newDate = $date instanceof Date ? $date : new Date($date);
  //   if (!newDate)
  //     throw new Error(`${$date} cannot be rendered as a valid date.`);

  //   newDate.setHours(0, 0, 0, 0);

  //   // console.log({ newDate });

  //   const year = newDate.getFullYear(),
  //     month = newDate.getMonth(),
  //     date = newDate.getDate(),
  //     day = newDate.getDay(),
  //     firstDay = new Date(year, month, 1).getDay(),
  //     lastDate = new Date(year, month + 1, 0).getDate(),
  //     strings = [MONTHS[month], DAYS[day]],
  //     dateString = `${strings[0]} ${date}, ${year}`;

  //   return {
  //     fullDate: newDate,
  //     year,
  //     month,
  //     date,
  //     day,
  //     firstDay,
  //     lastDate,
  //     strings,
  //     dateString,
  //   };
  // };

  const NOW = new Date();
  const [selected, setSelected] = useState(value);
  const [targetDate, setTargetDate] = useState(value);
  const target = useMemo(() => unpack(targetDate), [targetDate]);

  // -------------\ CREATE MONTH /-------------
  const createMonth = () => {
    const days = [];
    let prevLastDate = unpack(
      makeDate({
        ...target.obj,
        month: target.obj.month + 1,
        date: 0,
      })
    ).lastDate;

    if (target.firstDay > 0) {
      for (let i = target.firstDay; i > 0; i--) {
        const thisDate = unpack(target.change("date", prevLastDate--)!),
          isToday = thisDate.strings.full == TODAY.strings.full;

        // console.log({ thisDate, isToday });

        days.unshift(
          <Day
            key={"p" + i}
            className={styles.padding}
            thisDate={thisDate}
            isToday={isToday}
            isSelected={selected?.getTime() == thisDate.fullDate.getTime()}
          />
        );
      }
    }

    for (let i = 1; i <= target.lastDate; i++) {
      const thisDate = unpack(target.change("date", i)),
        // thisDate = unpack(new Date(target.year, target.month, i)),
        isToday = thisDate.strings.full == TODAY.strings.full;

      days.push(
        <Day
          key={i}
          thisDate={thisDate}
          isToday={isToday}
          isSelected={selected?.getTime() == thisDate.fullDate.getTime()}
          handleSelect={() => {
            handleChange(thisDate.fullDate);
            setSelected(thisDate.fullDate);
          }}
        />
      );
    }

    return days;
  };

  // -------------\ SHIFT MONTH /-------------
  const shiftMonth = (fwd = true) =>
    setTargetDate(target.change("month", target.obj.month + (fwd ? 1 : -1))!);
  // setTargetDate(new Date(target.year, target.month + (fwd ? 1 : -1), 1));

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
          {target.strings.month}
        </h2>
        <button
          className={`${styles.next} flex center jab under`}
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
      {createMonth()}
    </div>
  );
}
