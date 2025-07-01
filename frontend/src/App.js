import React, {useEffect, useState} from 'react';
import './App.css';
import CreateQuizPage from './CreateQuizPage';
import { exportQuizViaBackend } from './exportGift';
// Zmieniono importGift na użycie eksportowanej funkcji
import { importGiftFileToBackend } from './importGift';
import ShowQuizPage from './ShowQuizPage';

// function randomColor() {
//   const r = Math.floor(Math.random() * 160) + 90; // 150–255
//   const g = Math.floor(Math.random() * 160) + 90;
//   const b = Math.floor(Math.random() * 160) + 90;
//   return `rgb(${r}, ${g}, ${b})`;
// }

function App() {
  const [showingQuiz, setShowingQuiz] = useState(null);
  const [creatingQuiz, setCreatingQuiz] = useState(false);
  const [exportingQuiz, setExportingQuiz] = useState(false);
  const [importedQuiz, setImportedQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const bookIcons = ['📘', '📗', '📙', '📕', '📒', '📓'];

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = () => {
    fetch('http://localhost:8080/quizes')
        .then(res => res.json())
        .then(data => {
          const mapped = data.map((q,index)=> ({
            ...q,
            category: q.category || 'Brak kategorii',
            selected: false,
            // color: randomColor(),
            icon: bookIcons[index % bookIcons.length]
          }));
          setQuizzes(mapped);
        })
        .catch(err => {
          console.error('Error fetching quizzes:', err);
          alert('Błąd podczas pobierania quizów. Sprawdź, czy backend działa.');
        });
  };



  const getRandomBookIcon = () => {
    return bookIcons[Math.floor(Math.random() * bookIcons.length)];
  };



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
        .forEach(q => exportQuizViaBackend(q));
    setExportingQuiz(false);
  };

  const handleImportGiftClick = () => {
    document.getElementById('file-import-gift').click();
  };

  const handleImportGiftChange = e => {
    const file = e.target.files[0];
    if (file) {
      importGiftFileToBackend(
          file,
          (message) => { // onSuccess callback
            alert(`✅ Plik GIFT został pomyślnie przetworzony przez backend: ${message}`);
            fetchQuizzes(); // Odśwież listę quizów
          },
          (error) => { // onError callback
            console.error("❌ Błąd przesyłania lub przetwarzania pliku GIFT:", error);
            alert(`❌ Nie udało się zaimportować pliku GIFT: ${error.message}`);
          }
      );
    }
  };

  const handleShowQuiz = (id) => {
    console.log("Kliknięty quiz ID:", id);
    fetch(`http://localhost:8080/quizes/${id}`)
        .then(res => res.json())
        .then(data => setShowingQuiz(data))
        .catch(err => alert("Nie udało się pobrać quizu do podglądu."));
  };

  const handleBackFromQuiz = () => {
    setShowingQuiz(null);
  };


  const filtered = quizzes.filter(q =>
      (authorFilter ? q.author.toLowerCase().includes(authorFilter.toLowerCase()) : true) &&
      (categoryFilter ? q.category.toLowerCase().includes(categoryFilter.toLowerCase()) : true)
  );

  return (
      <div className="App">
        {!showingQuiz && !creatingQuiz && (
            <>
              <header>
                <h1>QuizMaster</h1>
                <p className="subtitle">Twórz i rozwiązuj quizy — bez logowania</p>
                <button className="create-btn" onClick={() => setCreatingQuiz(true)}>➕ Stwórz nowy quiz</button>
              </header>

              <div className="top-bar">
                <button onClick={handleExportClick}>📥 Export</button>
                <button onClick={handleImportGiftClick}>📂 Import</button>
                <input id="file-import-gift" type="file" accept=".gift" style={{ display: 'none' }} onChange={handleImportGiftChange} />
              </div>
            </>
        )}

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
                        <span>
                           <span style={{fontSize: '20px'}}>{getIconByCategory(q.category)}</span>
                           {q.title} — {q.author} [{q.category}]
                        </span>
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

        {!creatingQuiz && !showingQuiz ? (
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
                        style={{backgroundColor: q.color}}
                        onClick={() => handleShowQuiz(q.id)}
                    >
                      <span style={{fontSize: '20px'}}>{q.icon}</span>
                      {q.title}
                    </button>
                ))}
              </section>
            </>
        ) : creatingQuiz ? (
            <CreateQuizPage
                onCancel={() => setCreatingQuiz(false)}
                onQuizSaved={() => {
                  fetchQuizzes();
                  setCreatingQuiz(false);
                }}
            />
        ) : (
            <ShowQuizPage quiz={showingQuiz} onBack={handleBackFromQuiz} />
        )}
      </div>
  );
}

export default App;