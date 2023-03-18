import React, { useState } from "react";
import QuestionCard from "./components/QuestionCard";
import { fetchQuizQuestions, QuestionState } from "./API";

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
};

const TOTAL_QUESTIONS = 10;

function App() {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [diffuculty, setDiffuculty] = useState("");

  console.log(questions);

  const changeDiffuculty = (e: React.FormEvent<HTMLInputElement>) => {
    setDiffuculty(e.currentTarget.value);
  };

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS, diffuculty);
    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      // user answer
      const answer = e.currentTarget.value;
      // Correct Answer
      const correctAnswer = questions[number].correct_answer;
      // check answer against correct answer
      const correct = correctAnswer === answer;
      // add score is answer is correct
      if (correct) {
        setScore((prev) => prev + 1);
        e.currentTarget.classList.add("correct");
      } else {
        e.currentTarget.classList.add("false");
      }
      // save answer in the array for user answer
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
      setCorrectAnswer(questions[number].correct_answer);
    }
  };

  const nextQuestion = () => {
    // move on the next question if not the last question
    const nextQuestion = number + 1;

    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  return (
    <div className="container">
      <h1>QUIZ APP</h1>
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
        <div className="start-input-wrapper">
          <button className="start" onClick={startTrivia}>
            Start
          </button>
          <div className="input-wrapper">
            <div>
              <input
                type="radio"
                name="dif"
                id="easy"
                value="easy"
                onChange={changeDiffuculty}
              />
              <label>Easy</label>
            </div>
            <div>
              <input
                type="radio"
                name="dif"
                id="medium"
                value="medium"
                onChange={changeDiffuculty}
              />
              <label>Medium</label>
            </div>
            <div>
              <input
                type="radio"
                name="dif"
                id="hard"
                value="hard"
                onChange={changeDiffuculty}
              />
              <label>Hard</label>
            </div>
          </div>
        </div>
      ) : null}
      {!gameOver ? <p className="score">Score: {score}</p> : null}
      {loading && <p className="loading">Loading Questions...</p>}
      {!loading && !gameOver && (
        <QuestionCard
          questionNr={number + 1}
          totalQuestions={TOTAL_QUESTIONS}
          question={questions[number].question}
          answers={questions[number].answer}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
          correctAnswer={correctAnswer}
        />
      )}
      {!gameOver &&
      !loading &&
      userAnswers.length === number + 1 &&
      number !== TOTAL_QUESTIONS - 1 ? (
        <button className="next" onClick={nextQuestion}>
          Next Question
        </button>
      ) : null}
    </div>
  );
}

export default App;
