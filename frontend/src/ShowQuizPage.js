// src/ShowQuizPage.js
import React from 'react';
import './ShowQuizPage.css';

function ShowQuizPage({ quiz, onBack }) {
    if (!quiz) return <div>Brak danych do wyświetlenia.</div>;

    return (

        <div className="show-quiz-container">
            <button className="btn-back" onClick={onBack}>🔙 Powrót</button>
            <h2>{quiz.title}</h2>
            <p><strong>Autor:</strong> {quiz.author}</p>
            <p><strong>Data utworzenia:</strong> {quiz.creationDate}</p>

            {quiz.questions.map((q, qIndex) => (
                <div key={qIndex} className="show-question">
                    <h3>Pytanie #{qIndex + 1}</h3>
                    <p>{q.question}</p>
                    <ul>
                        {q.answers.map((a, aIndex) => (
                            <li key={aIndex}>
                                {a.answerText} ({a.pointsPerAnswer} pkt) {a.correct ? "✅" : ""}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            <button className="btn-back" onClick={onBack}>🔙 Powrót</button>
        </div>
    );
}

export default ShowQuizPage;
