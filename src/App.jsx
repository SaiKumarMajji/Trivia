import React from "react";
import Quiz from "./Quiz";


export default function App() { 

 const [showQuiz, setShowQuiz] = React.useState(false);


 const handleStartQuiz = () => {
  setShowQuiz(true);
};

  return (
    <>
    {showQuiz ? (
        <Quiz />
      ) : (
        <div className="intro-page">
          <h1 className="header">Quizzical</h1>
          <p className="description">Test your General Knowledge</p>
          <button className="start-quiz" onClick={handleStartQuiz}>
            Start quiz
          </button>
        </div>
      )}
    </>
    
  )
}