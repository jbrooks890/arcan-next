"use client";
import Mixed from "@/components/form/database/Mixed";
import DateField from "@/components/form/DateField";
import Toggle from "@/components/form/Toggle";
import Calendar from "@/components/frags/Calendar";
import Page from "@/components/layout/Page";
import { useState, CSSProperties } from "react";

export default function Sandbox() {
  const TODAY = new Date();
  TODAY.setHours(0, 0, 0, 0);

  const [date, setDate] = useState(TODAY);

  return (
    <Page name="Sandbox">
      <Calendar />
      <br />
      <DateField field="test" value={TODAY} handleChange={setDate} />
    </Page>
  );
}
