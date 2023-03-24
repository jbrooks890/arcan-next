"use client";
import useForm from "@/hooks/useForm";
import type { FieldType, FormDataType } from "@/hooks/useForm";

export default function UserGate({ login = true }) {
  const { field, text, form, password, email } = useForm();

  const POST_SUBMIT_MSG = (v: FormDataType): string => `## Welcome!
  ### Almost There.
  The last step is to **verify your email address**. A link has been sent to **_${v.email}_**. The link will expire in 72 hours. If this is not your email address or if the specified email address is incorrect you may change your email address in **Profile > Settings** and resend the verification email.`;

  const NAMESET = [text("$firstName"), text("$lastName")];

  const USERNAME = text("$username", {
    required: true,
    placeholder: "fishy_01",
  });
  const EMAIL = email(true);
  const DOB = field({
    name: "Date of Birth",
    field: "dob",
    type: "date",
    value: "VALUE",
    required: true,
  });
  const PASSWORD = password(!login);

  const fields = login
    ? [USERNAME, PASSWORD]
    : [USERNAME, EMAIL, DOB, PASSWORD];

  const content = form({
    name: login ? "Login" : "Register",
    fields,
    validate: !login,
    handleSubmit: () => {}, // TODO: go to AUTH route
    submitTxt: login ? "Go" : "Submit",
    postMessage: POST_SUBMIT_MSG,
  });
  return (
    <div style={{ width: "480px", overflow: "hidden" }}>
      {content}
      <br />
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
