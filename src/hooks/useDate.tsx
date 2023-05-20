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
  // strings: [keyof typeof months, keyof typeof days];
  strings: { month: keyof typeof months; day: keyof typeof days; full: string };
  value: string;
  change: (field: "year" | "month" | "date", value: number) => Date | null;
};

export default function useDate() {
  // ====================\ MAKE DATE /====================
  const makeDate = (
    dateObj: { year: number; month: number; date: number },
    strict = false
  ) => {
    const { year, month, date } = dateObj;
    // console.log({ year, month, date });
    if (strict) {
      if (
        Object.values(dateObj).some(value => value < 1) ||
        month > 12 ||
        date > 31
      )
        return null;
    }
    const result = new Date(year, month, date);
    return result;
  };

  // ====================\ UNPACK DATE /====================
  const unpackDate = (
    $date: string | number | Date,
    keepHrs = false
  ): DatePkg => {
    const newDate = $date instanceof Date ? $date : new Date($date);
    if (!newDate)
      throw new Error(`${$date} cannot be rendered as a valid date.`);

    if (keepHrs) newDate.setHours(0, 0, 0, 0);

    // console.log({ newDate });

    // --------------------\ VALUES /--------------------

    const year = newDate.getFullYear(),
      month = newDate.getMonth(),
      date = newDate.getDate(),
      day = newDate.getDay(),
      obj = { year, month, date },
      firstDay = days[new Date(year, month, 1).getDay()],
      lastDate = new Date(year, month + 1, 0).getDate(),
      strings: DatePkg["strings"] = {
        month: months[month],
        day: days[day],
      };
    strings.full = `${strings.month} ${date}, ${year}`;
    const change: DatePkg["change"] = (field, value) =>
      makeDate({ ...obj, [field]: value });

    return {
      fullDate: newDate,
      year,
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

  const NOW = new Date();
  const TODAY = unpackDate(NOW);

  return { months, days, unpackDate, makeDate, TODAY };
}
