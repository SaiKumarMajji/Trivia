import React, { useCallback } from "react";
import ClipLoader from "react-spinners/ClipLoader";

export default function Quiz() {
  const [questions, setQuestions] = React.useState([]);
  const [selectedAnswers, setSelectedAnswers] = React.useState({});
  const [showResults, setShowResults] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [score, setScore] = React.useState(0);

  const fetchQuestions = useCallback(() => {
    fetch(
      "https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple"
    )
      .then((res) => res.json())
      .then((data) => {
        const qs = data.results.map((q) => {
          const answers = [...q.incorrect_answers, q.correct_answer];
          return {
            id: q.question,
            question: q.question,
            answers: shuffleArray(answers),
            correctAnswer: q.correct_answer,
            selectedAnswer: null,
          };
        });
        setQuestions(qs);
      });
  }, []);

  React.useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function holdAnswer(questionId, selectedAnswer) {
    setSelectedAnswers((prevSelectedAnswers) => ({
      ...prevSelectedAnswers,
      [questionId]: selectedAnswer,
    }));
  }

  function checkAnswers() {
    const unansweredQuestions = questions.filter(
      (question) => !selectedAnswers[question.id]
    );

    if (unansweredQuestions.length > 0) {
      setErrorMessage("Please select answers for all questions");
    } else {
      setErrorMessage("");
      setShowResults(true);

      let newScore = 0;
      questions.forEach((question) => {
        if (selectedAnswers[question.id] === question.correctAnswer) {
          newScore += 1;
        }
      });
      setScore(newScore);
    }
  }

  function startNewGame() {
    setQuestions([]);
    setSelectedAnswers({});
    setShowResults(false);
    setErrorMessage("");
    setScore(0);
    fetchQuestions();
  }

  return (
    <div className="intro-page">
      {questions && questions.length > 0 ? (
        <>
          {questions.map((question) => (
            <div key={question.id}>
              <h1 className="q">{question.question}</h1>
              <div className="line">
                <div className="options">
                  {question.answers.map((answer, index) => {
                    const isSelected = selectedAnswers[question.id] === answer;
                    const isCorrect = question.correctAnswer === answer;
                    let backgroundColor = "white";
                    if (showResults) {
                      if (isSelected && isCorrect) {
                        backgroundColor = "#94D7A2";
                      } else if (isSelected && !isCorrect) {
                        backgroundColor = "#F8BCBC";
                      } else if (!isSelected && isCorrect) {
                        backgroundColor = "#94D7A2";
                      }
                    } else {
                      backgroundColor = isSelected ? "lightblue" : "white";
                    }
                    return (
                      <p
                        key={index}
                        onClick={() => holdAnswer(question.id, answer)}
                        style={{ backgroundColor }}
                        className="bg"
                      >
                        {answer}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
          {showResults ? (
            <div className="flex">
              <p className="scoreinfo">
                You scored {score}/{questions.length} correct answers{" "}
              </p>
              <button className="new-game" onClick={startNewGame}>
                Play again
              </button>
            </div>
          ) : (
            <button className="check" onClick={checkAnswers}>
              Check answers
            </button>
          )}
          {errorMessage && <p className="error">{errorMessage}</p>}
        </>
      ) : (
        <>
          {/* Loading quiz... */}
          <ClipLoader color={"grey"} />
        </>
      )}
    </div>
  );
}
