import React, {useState, useEffect} from 'react';
import './CreateQuizPage.css';

const emptyAnswer = () => ({text: '', points: 0});
const emptyQuestion = () => ({text: '', answers: [emptyAnswer()]});

function CreateQuizPage({onCancel, onQuizSaved}) {

    const [title, setTitle] = useState('');
    const [authorNickname, setAuthorNickname] = useState('');
    const [category, setCategory] = useState('');
    const [questions, setQuestions] = useState([emptyQuestion()]);
    const [errors, setErrors] = useState([]);
    const [toastMessage, setToastMessage] = useState(null);

    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    const handleQuestionTextChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].text = value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, emptyQuestion()]);
    };

    const removeQuestion = (index) => {
        if (questions.length <= 1) return;
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    const handleAnswerChange = (qIndex, aIndex, field, value) => {
        const newQuestions = [...questions];
        if (field === 'text') newQuestions[qIndex].answers[aIndex].text = value;
        if (field === 'points') newQuestions[qIndex].answers[aIndex].points = Number(value);
        setQuestions(newQuestions);
    };

    const handleCorrectToggle = (qIndex, aIndex, checked) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].answers[aIndex].points = checked ? 1 : 0;
        setQuestions(newQuestions);
    };

    const addAnswer = (qIndex) => {
        const newQuestions = [...questions];
        if (newQuestions[qIndex].answers.length >= 6) {
            setToastMessage(`Nie można dodać więcej niż 6 odpowiedzi do pytania #${qIndex + 1}.`);
            return;
        }
        newQuestions[qIndex].answers.push(emptyAnswer());
        setQuestions(newQuestions);
    };

    const removeAnswer = (qIndex, aIndex) => {
        const newQuestions = [...questions];
        if (newQuestions[qIndex].answers.length <= 1) return;
        newQuestions[qIndex].answers.splice(aIndex, 1);
        setQuestions(newQuestions);
    };

    const isMultipleCorrectAnswers = (question) => {
        return question.answers.filter(a => a.points > 0).length > 1;
    };

    const validate = () => {
        const errors = [];

        if (!category.trim()) {
            errors.push('Pole "Kategoria" nie może być puste.');
        }

        if (questions.length === 0) {
            errors.push('Quiz musi mieć co najmniej jedno pytanie.');
        }

        questions.forEach((q, i) => {
            if (!q.text.trim()) {
                errors.push(`Pytanie #${i + 1} jest puste.`);
            }
            if (q.answers.length === 0) {
                errors.push(`Pytanie #${i + 1} musi mieć co najmniej jedną odpowiedź.`);
            }

            let hasCorrectAnswer = false;
            q.answers.forEach((a, j) => {
                if (!a.text.trim()) {
                    errors.push(`Odpowiedź #${j + 1} w pytaniu #${i + 1} jest pusta.`);
                }
                if (isNaN(a.points)) {
                    errors.push(`Punkty odpowiedzi #${j + 1} w pytaniu #${i + 1} muszą być liczbą.`);
                }
                if (a.points > 0) {
                    hasCorrectAnswer = true;
                }
            });

            if (!hasCorrectAnswer) {
                errors.push(`Pytanie #${i + 1} musi mieć przynajmniej jedną poprawną odpowiedź.`);
            }
        });

        setErrors(errors);
        return errors.length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        const quiz = {
            title: title.trim(),
            author: authorNickname.trim(),
            category: category.trim(),
            questions: questions.map(q => ({
                question: q.text,
                answers: q.answers.map(a => ({
                    answerText: a.text,
                    pointsPerAnswer: a.points,
                    correct: a.points > 0
                })),
                maxPointsPerQuestion: q.answers
                    .filter(a => a.points > 0)
                    .reduce((acc, a) => acc + a.points, 0)
            }))
        };

        fetch('http://localhost:8080/add-quiz', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(quiz)
        })
            .then(res => {
                if (res.ok) {
                    alert('✅ Quiz został zapisany!');
                    onQuizSaved(); // to odświeży quizy
                    onCancel();
                } else {
                    return res.text().then(msg => {
                        throw new Error(msg || 'Błąd zapisu');
                    });
                }
            })
            .catch(err => {
                console.error('❌ Błąd zapisu quizu:', err);
                alert(`❌ Nie udało się zapisać quizu: ${err.message}`);
            });

    };

    return (
        <div className="create-quiz-container">
            <h2>Tworzenie nowego quizu</h2>


            <div className="quiz-type-select">
                <input
                    type="text"
                    placeholder="Tytuł quizu"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="author-nickname-category-input"
                />
                <input
                    type="text"
                    placeholder="Kategoria"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="author-nickname-category-input"
                />

                <input
                    type="text"
                    placeholder="Nickname autora"
                    value={authorNickname}
                    onChange={(e) => setAuthorNickname(e.target.value)}
                    className="author-nickname-category-input"
                />
            </div>

            <hr/>

            {questions.map((q, qIndex) => (
                <div className="question-card" key={qIndex}>
                    <div className="question-header">
                        <h3>Pytanie #{qIndex + 1}</h3>
                        <button
                            onClick={() => removeQuestion(qIndex)}
                            disabled={questions.length === 1}
                            className="btn-remove-question"
                        >
                            Usuń pytanie
                        </button>
                    </div>

                    <input
                        type="text"
                        placeholder="Treść pytania"
                        value={q.text}
                        onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                        className="question-input"
                    />

                    <p className="question-type-hint">
                        Typ pytania: {isMultipleCorrectAnswers(q) ? 'Wielokrotnego wyboru' : 'Jednokrotnego wyboru'}
                    </p>

                    <div className="answers-list">
                        {q.answers.map((a, aIndex) => (
                            <div className="answer-row" key={aIndex}>
                                <input
                                    type="text"
                                    placeholder="Treść odpowiedzi"
                                    value={a.text}
                                    onChange={(e) => handleAnswerChange(qIndex, aIndex, 'text', e.target.value)}
                                    className="answer-text-input"
                                />
                                <input
                                    type="number"
                                    placeholder="Punkty"
                                    value={a.points}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        handleAnswerChange(qIndex, aIndex, 'points', value);
                                    }}
                                    className="answer-points-input"
                                />
                                <label className="correct-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={a.points > 0}
                                        onChange={(e) => handleCorrectToggle(qIndex, aIndex, e.target.checked)}
                                        className="correct-checkbox"
                                    />
                                    Poprawna
                                </label>
                                <button
                                    onClick={() => removeAnswer(qIndex, aIndex)}
                                    disabled={q.answers.length === 1}
                                    className="btn-remove-answer"
                                >
                                    Usuń
                                </button>
                            </div>
                        ))}
                        <button onClick={() => addAnswer(qIndex)} className="btn-add-answer">
                            Dodaj odpowiedź
                        </button>
                    </div>
                </div>
            ))}

            <button onClick={addQuestion} className="btn-add-question">
                Dodaj pytanie
            </button>

            {errors.length > 0 && (
                <div className="errors-list">
                    <ul>
                        {errors.map((err, i) => (
                            <li key={i}>{err}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="actions-row">
                <button onClick={handleSave} className="btn-save-quiz">
                    Zapisz quiz
                </button>
                <button onClick={onCancel} className="btn-cancel">
                    Anuluj
                </button>
            </div>

            {toastMessage && (
                <div className="toast-notification">
                    {toastMessage}
                </div>
            )}
        </div>
    );
}

export default CreateQuizPage;
