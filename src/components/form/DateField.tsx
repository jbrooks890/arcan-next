import useDate from "@/hooks/useDate";
import styles from "@/styles/form/DateField.module.scss";
import { Fragment, useEffect, useRef } from "react";
import { debounce } from "@/utility/helperFns";

// ===========================================
// %%%%%%%%%%%%%%%\ COMPONENT /%%%%%%%%%%%%%%%
// ===========================================

export default function DateField({
  value = new Date(),
  handleChange,
  min,
  max,
  wrapper,
}: { value?: Date; min?: Date; max?: Date } & InputPropsType) {
  const { unpackDate: unpack, makeDate, TODAY } = useDate();
  const monthElement = useRef<HTMLDivElement | null>(null),
    dateElement = useRef<HTMLDivElement | null>(null),
    yearElement = useRef<HTMLDivElement | null>(null);

  const SOURCE = unpack(value),
    MIN = min ? unpack(min) : undefined,
    MAX = max ? unpack(max) : undefined,
    fields = ["month", "date", "year"],
    ranges = {
      month: [],
      date: [],
      year: [],
    };

  fields.forEach(field => {
    const isYear = field === "year";
    const size = isYear ? 4 : 2;
    const minimum = MIN?.[field] ?? (isYear ? TODAY.year - 10 : 1);
    const maximum =
      MAX?.[field] ??
      (isYear ? TODAY.year + 10 : field === "date" ? TODAY.lastDate : 12);

    for (let i = minimum; i <= maximum; i++) {
      const value = {
        value: i,
        display: i.toString().padStart(size, "0"),
      };
      ranges[field].unshift(value);
    }
  });

  const separator = <span />;

  useEffect(() => {
    [...document.querySelectorAll(`.${styles.option}.selected`)].forEach(
      element => element.scrollIntoView()
    );
    console.log({ monthElement, dateElement, yearElement });
    // monthElement.current?.scrollIntoView();
    // dateElement.current?.scrollIntoView();
    // yearElement.current?.scrollIntoView();
  }, [value]);

  // console.log({ TODAY });
  // console.log({ ranges });

  const scrollSelect = debounce(
    (e: UIEvent, field: "year" | "month" | "date") => {
      const { scrollHeight, scrollTop } = e.target || e.currentTarget,
        children = e.target.children.length,
        childHeight = Math.round(scrollHeight / children),
        index = Math.round(Math.round(scrollTop) / childHeight),
        queue = ranges[field],
        { value } = queue[index];

      // const target = makeDate({ ...SOURCE.obj, [field]: value });
      const target = SOURCE.change(field, value);

      field === "year" && console.log({ target });
      handleChange(target);
    },
    250
  );

  // =================| FIELDS |=================

  const FIELDS = fields.map((field, i, arr) => {
    const { month, date, year } = SOURCE,
      placeholder = ["MM", "DD", "YYYY"],
      size = field !== "year" ? 2 : 4,
      // _value = [month, date, year],
      _value = [month, date, year].map(int =>
        int.toString().padStart(size, "0")
      ),
      _min = [MIN?.month ?? 1, MIN?.date ?? 1, MIN?.year ?? TODAY.year - 10],
      _max = [
        MAX?.month ?? 12,
        MAX?.date ?? TODAY.lastDate,
        MAX?.year ?? TODAY.year + 10,
      ],
      refs = [monthElement, dateElement, yearElement];

    // console.log({ field, value: parseInt(_value[i]) });

    return (
      <Fragment key={field}>
        <div
          // ref={refs[i]}
          className={`${styles.shell} ${field} hide-scroller`}
          tabIndex={0}
          onMouseEnter={e => e.currentTarget.focus()}
          onScroll={e => scrollSelect(e, field)}
        >
          {ranges[field].map((entry, j) => {
            const { value, display } = entry;
            const isSelected = SOURCE[field] === value;

            return (
              <div
                key={j}
                ref={isSelected ? refs[i] : undefined}
                className={`${styles.option} ${field} ${
                  isSelected ? "selected" : "not-selected"
                } flex center`}
                {...{ [`data-${field}-option-value`]: value }}
              >
                {display}
              </div>
            );
          })}
        </div>
        {field !== "year" ? separator : undefined}
      </Fragment>
    );
  });

  const shiftDate = (fwd = true) =>
    handleChange(SOURCE.change("date", SOURCE.date + (fwd ? 1 : -1)));

  return (
    <div className={`${styles.wrap} flex middle justify`}>
      {FIELDS}
      <div className={styles.widget}>
        <div className={styles.wrapper}>
          <button
            onClick={e => {
              e.preventDefault();
              shiftDate();
            }}
          />
          <button
            onClick={e => {
              e.preventDefault();
              shiftDate(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}
