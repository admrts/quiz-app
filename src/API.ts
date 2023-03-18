import { shuffleArray } from "./utils";

export type Question = {
  category: string;
  correct_answer: string;
  diffuculty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
};

export type QuestionState = Question & { answer: string[] };

export const fetchQuizQuestions = async (
  amonut: number,
  diffuculty: string
) => {
  const endpoint = `https://opentdb.com/api.php?amount=${amonut}&diffuculty=${diffuculty}&type=multiple`;
  const data = await (await fetch(endpoint)).json();
  return data.results.map((question: Question) => ({
    ...question,
    answer: shuffleArray([
      ...question.incorrect_answers,
      question.correct_answer,
    ]),
  }));
};
