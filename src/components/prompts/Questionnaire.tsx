"use client";
import useForm from "@/hooks/useForm";
import useQuestions from "@/hooks/useQuestions";

export default function Questionnaire() {
  const { form, field } = useForm();
  const { choice, ask, questionList } = useQuestions();

  const SOURCES = [
    ..."Facebook; Twitter; Instagram; TikTok; YouTube; Twitch; Reddit; Discord; Book store; Amazon; Goodreads; Kickstarter; Patreon; Bookshelf"
      .split("; ")
      .sort(),
    "Friend",
  ];

  const questions = [
    // field("Name"),
    choice("How did you find out about _**Arcan**?_", SOURCES),
    choice(
      "Have you read _**Arcan: The Missing Nexus (1<sup>st</sup> Edition, 2016)**?_"
      // [
      //   {
      //     yes: [
      //       ask("What platform did you read it on?"),
      //       ask("What was your favorite part?"),
      //       choice(
      //         "Are you looking forward to future installments in the series?",
      //         ["Absolutely!", "Not really..."]
      //       ),
      //     ],
      //   },
      //   "no",
      // ]
    ),
    choice("Which genre do you prefer?", "Fantasy Sci-Fi Horror".split(" ")),
    choice(
      "What **_Arcan_** content are you most interested in?",
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
