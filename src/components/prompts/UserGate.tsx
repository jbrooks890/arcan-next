"use client";
import useForm from "@/hooks/useForm";

export default function UserGate({ login = true }) {
  const { field, text, form, password, email } = useForm();

  const NAMESET = [text("firstName"), text("lastName")];

  const fields = [
    text("username"),
    email(true),
    password(!login),
    field({
      name: "Date of Birth",
      field: "dob",
      type: "date",
      value: "VALUE",
      required: true,
    }),
  ];

  const content = form({
    name: `User ${login ? "Login" : "Registration"}`,
    fields,
    validate: true,
    handleSubmit: () => {}, // TODO: go to AUTH route
    submitTxt: login ? "Login" : "Register",
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
