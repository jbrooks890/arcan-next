import styles from "@/styles/Calendar.module.scss";
import { useReducer, useMemo, useState, useEffect } from "react";
import useDate, { DatePkg } from "@/hooks/useDate";
import Day from "./Day";

type CalendarProps = {
  value: Date | string | number;
  date?: string | number | Date;
  minimize?: boolean;
  min?: string | number | Date;
  max?: string | number | Date;
  handleChange: Function;
};

type State = {
  selected: DatePkg;
  view: DatePkg;
};

type Action =
  | {
      type: "select";
      payload: Date;
    }
  | { type: "change"; payload: Date }
  | { type: "reset" | "return"; payload?: undefined };

export default function Calendar({
  date,
  minimize = false,
  value,
  min,
  max,
  handleChange,
}: CalendarProps) {
  const {
      unpackDate: unpack,
      makeDate,
      isEqual,
      TODAY,
      days: DAYS,
    } = useDate(),
    $value = unpack(value instanceof Date ? value : new Date(value));
  // --------------------------------------
  const initialState: State = {
    selected: $value,
    view: $value,
  };
  const reducer = (state: State, action: Action) => {
    const { type, payload } = action;
    switch (type) {
      case "select":
        const target = unpack(payload);
        return {
          selected: target,
          view: target,
        };
      case "change":
        return {
          ...state,
          view: unpack(payload),
        };
      case "return":
        return {
          ...state,
          view: state.selected,
        };
      case "reset":
        return initialState;
      default:
        return state;
    }
  };
  // ~~~~~~~~~~~~~~| STATE |~~~~~~~~~~~~~~
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    dispatch({ type: "reset" });
  }, [value]);

  // -------------\ CREATE MONTH /-------------
  const createMonth = () => {
    const { selected, view } = state,
      days = [],
      start = 1 - view.firstDay,
      end = start + 42;

    for (let i = start; i < end; i++) {
      const thisDate = unpack(view.change("date", i)),
        isToday = isEqual(thisDate, TODAY),
        isSelected = isEqual(thisDate, selected),
        isPadding = i < 1 || i > view.lastDate;

      days.push(
        <Day
          key={i}
          thisDate={thisDate}
          isToday={isToday}
          isPadding={isPadding}
          isSelected={isSelected}
          handleSelect={() => {
            isPadding ? undefined : handleChange(thisDate.fullDate);
          }}
        />
      );
    }

    return days;
  };

  // -------------\ SHIFT MONTH /-------------
  const shiftMonth = (fwd = true) => {
    const { month } = state.view.obj;
    dispatch({
      type: "change",
      payload: state.view.change("month", month + (fwd ? 1 : -1)),
    });
  };

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
        <h2 className={`${styles.month} flex col`} data-year={state.view.year}>
          {state.view.strings.month}
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
