"use client";
import useForm from "@/hooks/useForm";

export default function Questionnaire() {
  const { form, choice, field } = useForm();

  const questions = [
    field("Name"),
    choice("Have you read *Arcan: The Missing Nexus (2016)*?", [
      {
        yes: [
          field("What platform did you read it on?"),
          field("What was your favorite part?"),
          choice(
            "Are you looking forward to future installments in the series?",
            ["Absolutely!", "Not really..."]
          ),
        ],
      },
      "no",
    ]),
    choice("Which genre do you prefer?", "Fantasy Science Fiction".split(" ")),
  ];

  return form({
    name: "Newcomer Questionnaire",
    fields: questions,
    handleSubmit: () => console.log("submitted!"),
    submitTxt: "Send",
  });
}
