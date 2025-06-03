import React, { useState, useEffect } from 'react';
import './CreateQuizPage.css';

const emptyAnswer = () => ({ text: '', points: 0 });
const emptyQuestion = () => ({ text: '', answers: [emptyAnswer()] });

function CreateQuizPage({ onCancel }) {
  const [quizType, setQuizType] = useState('single'); // 'single' lub 'multiple'
  const [authorNickname, setAuthorNickname] = useState('');
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

  const validate = () => {
    const errors = [];

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
      q.answers.forEach((a, j) => {
        if (!a.text.trim()) {
          errors.push(`Odpowiedź #${j + 1} w pytaniu #${i + 1} jest pusta.`);
        }
        if (isNaN(a.points)) {
          errors.push(`Punkty odpowiedzi #${j + 1} w pytaniu #${i + 1} muszą być liczbą.`);
        }
      });
    });

    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    alert('Quiz gotowy do zapisu! (tu pójdzie do backendu)');
  };

  return (
    <div className="create-quiz-container">
      <h2>Tworzenie nowego quizu</h2>

      <div className="quiz-type-select">
        <div className="quiz-type-options">
          <label>
            <input
              type="radio"
              name="quizType"
              value="single"
              checked={quizType === 'single'}
              onChange={() => setQuizType('single')}
            />
            Test jednokrotnego wyboru
          </label>
          <label style={{ marginLeft: 20 }}>
            <input
              type="radio"
              name="quizType"
              value="multiple"
              checked={quizType === 'multiple'}
              onChange={() => setQuizType('multiple')}
            />
            Test wielokrotnego wyboru
          </label>
        </div>

        <input
          type="text"
          placeholder="Nickname autora (opcjonalnie)"
          value={authorNickname}
          onChange={(e) => setAuthorNickname(e.target.value)}
          className="author-nickname-input"
        />
      </div>

      <hr />

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
                  onChange={(e) => handleAnswerChange(qIndex, aIndex, 'points', e.target.value)}
                  className="answer-points-input"
                />
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

      {/* Toast */}
      {toastMessage && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default CreateQuizPage;
