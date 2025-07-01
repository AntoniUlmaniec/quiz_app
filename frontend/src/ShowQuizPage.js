import React, { useState } from 'react';
import './ShowQuizPage.css';

function ShowQuizPage({ quiz, onBack }) {
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    if (!quiz) return <div>Brak danych do wyświetlenia.</div>;

    const isMultipleChoice = (question) => {
        return question.answers.filter(a => a.correct).length > 1;
    };

    const handleSelect = (questionIndex, answerIndex, isMulti) => {
        setSelectedAnswers((prev) => {
            const current = prev[questionIndex] || [];

            if (isMulti) {
                const updated = current.includes(answerIndex)
                    ? current.filter(i => i !== answerIndex)
                    : [...current, answerIndex];
                return { ...prev, [questionIndex]: updated };
            } else {
                return { ...prev, [questionIndex]: [answerIndex] };
            }
        });
    };

    const handleSubmit = () => {
        let totalScore = 0;

        quiz.questions.forEach((q, qIndex) => {
            const selected = selectedAnswers[qIndex] || [];

            let scoreForQuestion = 0;

            selected.forEach(answerIndex => {
                const answer = q.answers[answerIndex];
                if (answer?.correct) {
                    scoreForQuestion += answer.pointsPerAnswer;
                } else {
                    scoreForQuestion += answer.pointsPerAnswer; // Dodaj punkty nawet za błędne odpowiedzi
                }
            });

            totalScore += Math.max(scoreForQuestion, 0);
        });

        setScore(totalScore);
        setSubmitted(true);
    };

    return (
        <div className="show-quiz-container">
            <button className="btn-back" onClick={onBack}>🔙 Powrót</button>

            <h2>{quiz.title}</h2>
            <p><strong>Autor:</strong> {quiz.author}</p>
            <p><strong>Data utworzenia:</strong> {quiz.creationDate}</p>
            <p><strong>Kategoria:</strong> {quiz.category}</p>

            {quiz.questions.map((q, qIndex) => {
                const isMulti = isMultipleChoice(q);
                const selected = selectedAnswers[qIndex] || [];

                return (
                    <div key={qIndex} className="show-question">
                        <h3>Pytanie #{qIndex + 1}</h3>
                        <p>{q.question}</p>
                        <ul>
                            {q.answers.map((a, aIndex) => {
                                const isChecked = selected.includes(aIndex);
                                const isCorrect = a.correct;
                                const pointsText = `${a.pointsPerAnswer >= 0 ? '+' : ''}${a.pointsPerAnswer} pkt`;

                                let feedback = "";
                                let answerClass = "";

                                if (submitted) {
                                    if (isChecked) {
                                        feedback = isCorrect
                                            ? `✅ (${pointsText})`
                                            : `❌ (${pointsText})`;
                                        answerClass = isCorrect
                                            ? "correct-selected"
                                            : "incorrect-selected";
                                    } else if (isCorrect) {
                                        feedback = `✅ (${pointsText})`;
                                        answerClass = "correct-unselected";
                                    } else {
                                        feedback = `(${pointsText})`;
                                    }
                                }

                                return (
                                    <li key={aIndex} className={submitted ? answerClass : ""}>
                                        <label>
                                            <input
                                                type={isMulti ? "checkbox" : "radio"}
                                                name={`question-${qIndex}`}
                                                value={aIndex}
                                                checked={isChecked}
                                                onChange={() => handleSelect(qIndex, aIndex, isMulti)}
                                                disabled={submitted}
                                            />
                                            {a.answerText} {submitted && feedback}
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                );
            })}

            {!submitted ? (
                <button onClick={handleSubmit}>✅ Zakończ quiz</button>
            ) : (
                <div className="result-summary">
                    <h3>Twój wynik: {score} / {quiz.maxPointsPerQuiz} pkt</h3>
                    <h4>Procent: {Math.round((score / quiz.maxPointsPerQuiz) * 100)}%</h4>
                    <button className="btn-back" onClick={onBack}>🔙 Powrót</button>
                </div>
            )}
        </div>
    );
}

export default ShowQuizPage;