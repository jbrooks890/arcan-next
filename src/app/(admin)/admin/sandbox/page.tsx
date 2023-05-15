"use client";
import Mixed from "@/components/form/database/Mixed";
import Toggle from "@/components/form/Toggle";
import Page from "@/components/layout/Page";
import { useState, CSSProperties } from "react";

export default function Sandbox() {
  const [checked, setChecked] = useState();
  const labelStyle: CSSProperties = {
    position: "relative",
    border: "var(--input)",
    padding: "2rem",
  };
  return (
    <Page name="Sandbox">
      <Toggle
        field="test"
        value={checked ?? false}
        handleChange={() => setChecked(prev => !prev)}
        wrapper={{ name: "test", field: "test" }}
      />
      <br />
      <label htmlFor="test2" style={labelStyle}>
        <span>Test 2</span>
        <Toggle
          field="test2"
          value={checked ?? false}
          handleChange={() => setChecked(prev => !prev)}
          // wrapper={{ name: "test2", field: "test2" }}
        />
      </label>
    </Page>
  );
}
