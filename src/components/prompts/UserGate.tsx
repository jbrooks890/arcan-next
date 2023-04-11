"use client";
import { useEffect, useState } from "react";
import useForm from "@/hooks/useForm";
import type { FieldType, FormMasterType } from "@/hooks/useForm";
import axios from "../../interfaces/axios";
import styles from "@/styles/UserGate.module.scss";
import { AxiosError } from "axios";

export default function UserGate({ loginMode = true }) {
  const [login, setLogin] = useState(loginMode);
  const {
    form,
    field,
    text,
    number,
    boolean,
    password,
    email,
    date,
    group,
    isSubmitted,
  } = useForm();

  const UNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  const POST_SUBMIT_MSG = (v: FormMasterType): string => `## Welcome!
  ### Almost There.
  The last step is to **verify your email address**. A link has been sent to **_${v.email}_**. The link will expire in 72 hours. If this is not your email address or if the specified email address is incorrect you may change your email address in **Profile > Settings** and request a new verification link.`;

  const claimUsername = async (username: string) => {
    console.log({ username });
    try {
      const response = await axios.get(`/users/${username}?allow=true`);
      // console.log(`%cRESPONSE:`, "color:coral", response.data);
      const { user } = response.data;
      return !user;
    } catch (err: AxiosError | Error) {
      // console.err("TEST" + "%".repeat(20), err);
      // console.warn({ err });
      if (err.response.status >= 500 && err.response.status < 600)
        throw new Error(err.message);
      return true;
    }
  };

  const NAME_FIELDS = [
    text("$firstName", false, { placeholder: "Jane" }),
    // text("$middleName", false),
    text("$lastName", false, { placeholder: "Doe" }),
    // group("$preferredName", [
    //   boolean("$cheeseMan"),
    //   text("$preferredNameEntry", false),
    // ]),
  ];
  const NAME = group("name", NAME_FIELDS);

  const PATREON_FIELDS = [
    field({ name: "Are you a Patron?", field: "isPatron", type: "boolean" }),
    email({ name: "Patreon Email", field: "patronEmail" }),
    field({
      name: "Same as above",
      field: "sameEmail",
      type: "boolean",
      value: true,
    }),
  ];

  const PATREON = group("$patreon", PATREON_FIELDS);

  const unameCriteria =
    "Username must be 3-23 characters, may not contain special characters";
  const pwdCriteria = "Password must be 8-24 characters, may include: !@#$%";

  const USERNAME = text("$username*", false, {
    value: "arcanboi",
    placeholder: !login ? "fishy_01" : undefined,
    validation: !login
      ? [
          {
            validator: v => UNAME_REGEX.test(v),
            criteria: unameCriteria,
          },
          {
            validator: v => claimUsername(v),
            criteria: "Username must be available",
            // error: `'${v}' is unavailable`
            error: "Username is unavailable",
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
  const DOB = date("$dob*");
  const PASSWORD = password(
    !login,
    !login
      ? {
          validation: [
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
            {
              validator: v => PWD_REGEX.test(v),
              criteria: pwdCriteria,
            },
          ],
        }
      : {}
  );

  const fields = login
    ? [USERNAME, PASSWORD]
    : [USERNAME, EMAIL, NAME, PATREON, DOB, PASSWORD]; // TODO: remove NAME

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
