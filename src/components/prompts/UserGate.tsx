"use client";
import { useEffect, useState } from "react";
import useForm from "@/hooks/useForm";
import type { FieldType, FormDataType } from "@/hooks/useForm";
import axios from "../../interfaces/axios";
import styles from "@/styles/UserGate.module.scss";

export default function UserGate({ loginMode = true }) {
  const [login, setLogin] = useState(loginMode);
  const {
    field,
    text,
    form,
    password,
    email,
    date,
    isSubmitted,
    group,
    number,
  } = useForm();

  const UNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  const POST_SUBMIT_MSG = (v: FormDataType): string => `## Welcome!
  ### Almost There.
  The last step is to **verify your email address**. A link has been sent to **_${v.email}_**. The link will expire in 72 hours. If this is not your email address or if the specified email address is incorrect you may change your email address in **Profile > Settings** and request a new verification link.`;

  const claimUsername = async (username: string) => {
    const response = await axios.get(`/users/${username}`);
    const { user } = response.data;
    return !!user;
  };

  const NAME_FIELDS = [
    text("$firstName", false, { placeholder: "Jane" }),
    text("$middleName", false),
    text("$lastName", false, { placeholder: "Doe" }),
  ];
  const NAME = group("name", NAME_FIELDS);

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

  const unameCriteria =
    "Username must be 3-23 characters, may not contain special characters";
  const pwdCriteria = "Password must be 8-24 characters, may include: !@#$%";

  const USERNAME = text("$username", false, {
    required: true,
    placeholder: !login ? "fishy_01" : undefined,
    validation: !login
      ? [
          {
            validator: v => claimUsername(v.username),
            criteria: "Username must be available",
          },
          {
            validator: v => UNAME_REGEX.test(v),
            criteria: unameCriteria,
          },
          {
            validator: v => v.length >= 3,
            criteria: unameCriteria,
            error: "Username is too short",
          },
          {
            validator: v => v.length <= 23,
            criteria: unameCriteria,
            error: "Username is too long",
          },
        ]
      : undefined,
  });
  const EMAIL = email({
    required: true,
    placeholder: !login ? "jane_doe01@gmail.com" : undefined,
    validation: v => EMAIL_REGEX.test(v),
  });
  const DOB = date("$dob", { required: true });
  const PASSWORD = password(
    !login,
    !login
      ? {
          validation: [
            {
              validator: v => PWD_REGEX.test(v),
              criteria: pwdCriteria,
            },
            {
              validator: v => v.length >= 8,
              criteria: pwdCriteria,
              error: "Password is too short",
            },
            {
              validator: v => v.length <= 24,
              criteria: pwdCriteria,
              error: "Password is too long",
            },
          ],
        }
      : {}
  );

  const fields = login
    ? [USERNAME, PASSWORD]
    : [USERNAME, EMAIL, NAME, DOB, PASSWORD];

  const content = form({
    name: login ? "Login" : "Register",
    fields,
    validate: !login,
    handleSubmit: () => {}, // TODO: go to AUTH route
    submitTxt: login ? "Go" : "Submit",
    postMessage: POST_SUBMIT_MSG,
  });
  return (
    <div className={styles.wrapper}>
      {content}
      <br />
      {isSubmitted() ? undefined : login ? (
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
