"use client";
import Mixed from "@/components/form/database/Mixed";
import Toggle from "@/components/form/Toggle";
import Calendar from "@/components/frags/Calendar";
import Page from "@/components/layout/Page";
import { useState, CSSProperties } from "react";

export default function Sandbox() {
  return (
    <Page name="Sandbox">
      <Calendar />
    </Page>
  );
}
