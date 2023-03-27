"use client";
import useForm from "@/hooks/useForm";
import type { FieldType, FormDataType } from "@/hooks/useForm";
import axios from "../../interfaces/axios";
import { useState } from "react";

export default function UserGate({ loginMode = true }) {
  const [login, setLogin] = useState(loginMode);
  const { field, text, form, password, email } = useForm();

  const UNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  const POST_SUBMIT_MSG = (v: FormDataType): string => `## Welcome!
  ### Almost There.
  The last step is to **verify your email address**. A link has been sent to **_${v.email}_**. The link will expire in 72 hours. If this is not your email address or if the specified email address is incorrect you may change your email address in **Profile > Settings** and resend the verification email.`;

  const claimUsername = async (username: string) => {
    const response = await axios.get(`/users/${username}`);
    const { user } = response.data;
    return !!user;
  };

  const PATREON = [
    field({ name: "Are you a Patron?", field: "isPatron", type: "boolean" }),
    email({ name: "Patreon Email", field: "patronEmail" }),
    field({
      name: "Same as above",
      field: "sameEmail",
      type: "boolean",
      value: false,
    }),
  ];

  const USERNAME = text("$username", {
    required: true,
    placeholder: "fishy_01",
    validation: !login
      ? [
          {
            validator: v => claimUsername(v.username),
            criteria: "Username must be available",
          },
          {
            validator: v => UNAME_REGEX.test(v),
            criteria: "3-23 characters; no spaces or special characters",
          },
          {
            validator: v => v.length >= 3,
            criteria: "Username must be at least 3 characters",
            error: "Username is too short",
          },
          {
            validator: v => v.length <= 23,
            criteria: "Username cannot be more than 23 characters",
            error: "Username is too long",
          },
        ]
      : undefined,
  });
  const EMAIL = email({
    required: true,
    validation: v => EMAIL_REGEX.test(v),
  });
  const DOB = field({
    name: "Date of Birth",
    field: "dob",
    type: "date",
    value: "VALUE",
    required: true,
  });
  const PASSWORD = password(
    !login,
    !login
      ? {
          validation: [
            {
              validator: v => PWD_REGEX.test(v),
              criteria:
                "8-24 characters; alphanumeric characters; allowed special characters (!@#$%)",
            },
            {
              validator: v => v.length >= 8,
              criteria: "Password must be at least 8 characters",
              error: "Password is too short",
            },
            {
              validator: v => v.length <= 24,
              criteria: "Password cannot be more than 24 characters",
              error: "Password is too long",
            },
          ],
        }
      : {}
  );

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
          Not a member?{" "}
          <button onClick={() => setLogin(false)}>Sign up.</button>
        </>
      ) : (
        <>
          Have an account?{" "}
          <button onClick={() => setLogin(true)}>Login.</button>
        </>
      )}
    </div>
  );
}
