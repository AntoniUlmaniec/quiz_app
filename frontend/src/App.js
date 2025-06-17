import React, { useState } from 'react';
import './App.css';
import CreateQuizPage from './CreateQuizPage';
import { exportQuizViaBackend } from './exportGift';
import './exportGift';
import { importGiftFile } from './importGift';

function randomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
}

function App() {
  const [creatingQuiz, setCreatingQuiz] = useState(false);
  const [exportingQuiz, setExportingQuiz] = useState(false);
  const [importedQuiz, setImportedQuiz] = useState(null);

  const [quizzes, setQuizzes] = useState([
    { id: 1, title: 'Quiz: HTML & CSS', author: 'John Doe', category: 'Web Dev', selected: false },
    { id: 2, title: 'Quiz: JavaScript', author: 'Jane Smith', category: 'Programming', selected: false },
    { id: 3, title: 'Quiz: Podstawy Javy', author: 'Jan Kowalski', category: 'Programming', selected: false },
  ]);

  const [authorFilter, setAuthorFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const handleCheckboxChange = (id) => {
    setQuizzes(qs => qs.map(q => q.id === id ? { ...q, selected: !q.selected } : q));
  };

  const handleExportClick = () => {
    setExportingQuiz(true);
  };

  const handleExport = () => {
    quizzes
        .filter(q => q.selected)
        .forEach(q => exportQuizViaBackend(q));  // wywołanie funkcji
    setExportingQuiz(false);
  };

  const handleImportClick = () => {
    document.getElementById('file-import').click();
  };

  const handleImportChange = e => {
    const file = e.target.files[0];
    if (file) importGiftFile(file, data => setImportedQuiz(data));
  };

  const filtered = quizzes.filter(q =>
      (authorFilter ? q.author.toLowerCase().includes(authorFilter.toLowerCase()) : true) &&
      (categoryFilter ? q.category.toLowerCase().includes(categoryFilter.toLowerCase()) : true)
  );

  return (
      <div className="App">
        {/* Header */}
        <header>
          <h1>QuizMaster</h1>
          <p className="subtitle">Twórz i rozwiązuj quizy — bez logowania</p>
          <button className="create-btn" onClick={() => setCreatingQuiz(true)}>➕ Stwórz nowy quiz</button>
        </header>

        {/* Import/Export Buttons */}
        <div className="top-bar">
          <button onClick={handleExportClick}>📥 Export</button>
          <button onClick={handleImportClick}>📂 Import</button>
          <input id="file-import" type="file" accept=".gift" style={{ display: 'none' }} onChange={handleImportChange} />
        </div>

        {/* Export Modal */}
        {exportingQuiz && (
            <div className="modal-backdrop">
              <div className="modal export-modal">
                <h3>Wybierz quizy do eksportu</h3>
                <div className="filter-group">
                  <label htmlFor="filter-author">Filtruj po autorze:</label>
                  <input
                      id="filter-author"
                      type="text"
                      placeholder="Autor"
                      value={authorFilter}
                      onChange={e => setAuthorFilter(e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <label htmlFor="filter-category">Filtruj po kategorii:</label>
                  <input
                      id="filter-category"
                      type="text"
                      placeholder="Kategoria"
                      value={categoryFilter}
                      onChange={e => setCategoryFilter(e.target.value)}
                  />
                </div>
                <div className="export-list">
                  {filtered.map(q => (
                      <div key={q.id} className="export-item">
                        <span>{q.title} — {q.author} [{q.category}]</span>
                        <input
                            type="checkbox"
                            checked={q.selected}
                            onChange={() => handleCheckboxChange(q.id)}
                        />
                      </div>
                  ))}
                </div>
                <div className="modal-buttons">
                  <button onClick={handleExport}>Eksportuj</button>
                  <button onClick={() => setExportingQuiz(false)}>Anuluj</button>
                </div>
              </div>
            </div>
        )}



        {/* Main Content */}
        {!creatingQuiz ? (
            <>
              {importedQuiz && (
                  <div className="imported">
                    <h3>Zaimportowany quiz:</h3>
                    <pre>{JSON.stringify(importedQuiz, null, 2)}</pre>
                  </div>
              )}
              <section className="quiz-grid">
                {quizzes.map(q => (
                    <button
                        key={q.id}
                        className="quiz-button"
                        style={{ backgroundColor: randomColor() }}
                        onClick={() => alert(`Wybrałeś: ${q.title}`)}
                    >
                      {q.title}
                    </button>
                ))}
              </section>
            </>
        ) : (
            <CreateQuizPage onCancel={() => setCreatingQuiz(false)} />
        )}
      </div>
  );
}

export default App;
