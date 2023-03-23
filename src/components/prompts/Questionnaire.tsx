"use client";
import useForm from "@/hooks/useForm";

export default function Questionnaire() {
  const { form, choice, field, ask, questionList } = useForm();

  const questions = [
    // field("Name"),
    choice("Have you read **_Arcan: The Missing Nexus (1<sup>st</sup> Edition, 2016)_**?", [
      {
        yes: [
          ask("What platform did you read it on?"),
          ask("What was your favorite part?"),
          choice(
            "Are you looking forward to future installments in the series?",
            ["Absolutely!", "Not really..."]
          ),
        ],
      },
      "no",
    ]),
    choice("Which genre do you prefer?", "Fantasy Science-Fiction".split(" ")),
    choice(
      "What content are you most interested in?",
      "Books Lore World Characters Magic Creatures".split(" ").sort(),
      true
    ),
  ];

  return (
    <>
      {form({
        name: "Newcomer Questionnaire",
        fields: questionList(questions),
        handleSubmit: () => console.log("submitted!"),
        submitTxt: "Send",
      })}
    </>
  );
}
