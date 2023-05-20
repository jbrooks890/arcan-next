const months = [
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
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;
const dayAbbr = ["U", "M", "T", "W", "R", "F", "S"] as const;
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
] as const;

export type DatePkg = {
  fullDate: Date;
  year: number;
  month: number;
  date: number;
  day: number;
  obj: { year: number; month: number; date: number };
  firstDay: number;
  lastDate: number;
  isToday: boolean;
  strings: {
    month: (typeof months)[number];
    day: (typeof days)[number];
    full: string;
    firstDay: (typeof days)[number];
  };
  // value: string;
  change: (field: "year" | "month" | "date", value: number) => Date;
};

export default function useDate() {
  // ----------------------\ VALUES /----------------------
  const NOW = new Date();
  // ====================\ MAKE DATE /====================
  const makeDate = (
    dateObj: { year: number; month: number; date: number },
    strict = false
  ) => {
    const { year, month, date } = dateObj;
    // console.log({ year, month, date });
    // if (strict) {
    //   if (
    //     Object.values(dateObj).some(value => value < 1) ||
    //     month > 12 ||
    //     date > 31
    //   )
    //     return null;
    // }
    const result = new Date(year, month, date);
    return result;
  };

  // ====================\ IS EQUAL /====================
  const isEqual = (a: DatePkg["obj"], b: DatePkg["obj"]) =>
    Object.keys(a).every(
      key => a[key as keyof typeof a] === b[key as keyof typeof b]
    );

  // ====================\ UNPACK DATE /====================
  const unpackDate = (
    $date: string | number | Date,
    keepHrs = false
  ): DatePkg => {
    const newDate = $date instanceof Date ? $date : new Date($date);
    if (!newDate)
      throw new Error(`${$date} cannot be rendered as a valid date.`);

    if (keepHrs) newDate.setHours(0, 0, 0, 0);

    // --------------------\ VALUES /--------------------

    const year = newDate.getFullYear(),
      month = newDate.getMonth(),
      date = newDate.getDate(),
      day = newDate.getDay(),
      obj = { year, month, date },
      firstDay = new Date(year, month, 1).getDay(),
      lastDate = new Date(year, month + 1, 0).getDate(),
      // isToday = isEqual(obj, unpackDate(NOW).obj),
      strings: Omit<DatePkg["strings"], "full"> = {
        month: months[month],
        day: days[day],
        firstDay: days[new Date(year, month, 1).getDay()],
      };
    strings.full = `${strings.month} ${date}, ${year}`;
    strings.fullest = `${strings.day}, ${strings.full}`;
    const change: DatePkg["change"] = (field, value) =>
      makeDate({ ...obj, [field]: value });

    return {
      fullDate: newDate,
      year,
      // month,
      month: month + 1,
      date,
      day,
      obj,
      firstDay,
      lastDate,
      strings,
      change,
    };
  };

  const TODAY = unpackDate(NOW);
  const isToday = (dateObj: DatePkg["obj"]) => isEqual(dateObj, TODAY.obj);

  return { months, days, unpackDate, makeDate, isEqual, isToday, TODAY };
}
