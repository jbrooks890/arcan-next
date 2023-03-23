"use client";
import useForm from "@/hooks/useForm";
import type { FieldType } from "@/hooks/useForm";

export default function UserGate({ login = true }) {
  const { field, text, form, password, email } = useForm();

  const NAMESET = [text("firstName"), text("lastName")];

  const fields = [
    text("username"),
    !login?email(true):undefined,
    !login?field({
      name: "Date of Birth",
      field: "dob",
      type: "date",
      value: "VALUE",
      required: true,
    }):undefined,
    password(!login),
  ].filter(Boolean)

  const content = form({
    name: login?"Login":"Register",
    fields,
    validate: !login,
    handleSubmit: () => {}, // TODO: go to AUTH route
    submitTxt: login ? "Go" : "Submit",
  });
  return (
    <div style={{ width: "480px", overflow: "hidden" }}>
      {content}
      {login ? (
        <>
          Not a member? <strong>Sign up.</strong>
        </>
      ) : (
        <>
          Have an account? <strong>Login.</strong>
        </>
      )}
    </div>
  );
}
