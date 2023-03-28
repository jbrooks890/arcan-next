import type { FieldType, FieldTypeEnum } from "./useForm";
import { makeHTMLSafe } from "@/lib/utility";
import useForm from "./useForm";

export default function useQuestions() {
  const { form, select } = useForm();

  type QuestionType = Omit<FieldType, "required" | "field">;

  const ask = (
    question: string,
    type = "string" as FieldTypeEnum,
    options?: FieldType
  ) => ({
    name: question,
    type,
    ...options,
  });

  const choice = (
    name: string,
    choices?: (string | object)[],
    multi = false,
    options?: Partial<Omit<QuestionType, "type">>
  ): QuestionType => {
    return {
      name,
      type: "select",
      choices: choices ?? "Yes No".split(" "),
      ...options,
      options: {
        multi,
        ...options?.options,
      },
    };
  };

  const questionList = (
    questions: QuestionType[],
    name?: string
  ): FieldType[] => {
    return questions.map(
      (question, i): FieldType => ({
        name: question.name,
        field: (name ? `${makeHTMLSafe(name)}-` : "Q") + (i + 1),
        type: question.type,
        value: question.value,
      })
    );
  };

  return { ask, choice, questionList };
}
