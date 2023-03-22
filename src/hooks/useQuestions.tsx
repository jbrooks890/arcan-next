import type { FieldType, FieldTypeEnum } from "./useForm";
import { makeHTMLSafe } from "@/lib/utility";
import useForm from "./useForm";

export default function useQuestions() {
  const { form } = useForm();

  const ask = (
    question: string,
    type = "string" as FieldTypeEnum,
    value?: any
  ) => ({
    name: question,
    type,
    value,
  });

  const questionList = (questions: any[], name?: string): FieldType[] => {
    return questions.map((question, i): FieldType => {
      return {
        name: question.name,
        field: (name ? `${makeHTMLSafe(name)}-` : "Q") + (i + 1),
        type: question.type,
        value: question.value,
      };
    });
  };

  return { ask, questionList };
}
