import React, { useState } from 'react';
import './App.css';
import CreateQuizPage from './CreateQuizPage';

function App() {
  const [creatingQuiz, setCreatingQuiz] = useState(false);

  return (
    <div className="App">
      {!creatingQuiz ? (
        <>
          <header>
            <h1>QuizMaster</h1>
            <p className="subtitle">Twórz i rozwiązuj quizy — bez logowania</p>
            <button className="create-btn" onClick={() => setCreatingQuiz(true)}>
              ➕ Stwórz nowy quiz
            </button>
          </header>

          <section className="quiz-list">
            <h2>Dostępne quizy</h2>
            <ul>
              <li className="quiz-item">📘 Quiz: HTML & CSS</li>
              <li className="quiz-item">📗 Quiz: JavaScript</li>
              <li className="quiz-item">📙 Quiz: Podstawy Javy</li>
            </ul>
          </section>
        </>
      ) : (
        <CreateQuizPage onCancel={() => setCreatingQuiz(false)} />
      )}
    </div>
  );
}

export default App;
