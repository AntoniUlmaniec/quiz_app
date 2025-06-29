import React, {useEffect, useState} from 'react';
import './App.css';
import CreateQuizPage from './CreateQuizPage';
import { exportQuizViaBackend } from './exportGift';
import './exportGift';
import { importGiftFile } from './importGift';

function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

function App() {
  const [creatingQuiz, setCreatingQuiz] = useState(false);
  const [exportingQuiz, setExportingQuiz] = useState(false);
  const [importedQuiz, setImportedQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  // const [quizzes, setQuizzes] = useState([
  //   { id: 1, title: 'Quiz: HTML & CSS', author: 'John Doe', category: 'Web Dev', selected: false,color: randomColor() },
  //   { id: 2, title: 'Quiz: JavaScript', author: 'Jane Smith', category: 'Programming', selected: false ,color: randomColor()},
  //   { id: 3, title: 'Quiz: Podstawy Javy', author: 'Jan Kowalski', category: 'Programming', selected: false ,color: randomColor()},
  // ]);

  useEffect(() => {
    fetch('http://localhost:8080/quizes')
        .then(res => res.json())
        .then(data => {
          // Map backend data to frontend structure
          const mapped = data.map(q => ({
            ...q,
            category: 'Brak kategorii', // or map if you have category
            selected: false,
            color: randomColor(),
          }));
          setQuizzes(mapped);
        })
        .catch(err => {
          console.error('Error fetching quizzes:', err);
        });
  }, []);

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
    if (file) {



      // Wyślij plik do backendu
      const formData = new FormData();
      formData.append("file", file);

      fetch("http://localhost:8080/import", {
        method: "POST",
        body: formData,
      })
          .then(res => res.text().then(text => {
            if (res.ok) {
              alert("✅ Plik został wysłany do backendu: " + text);
              alert("✅ Plik został wysłany do backendu");
              // Dodaj kafelek od razu
              const newQuiz = {
                id: Math.floor(Math.random() * 10000),
                title: file.name.replace(".gift", ""),
                author: "Z pliku .gift",
                category: "Import",
                selected: false,
                color: randomColor()
              };
              setQuizzes(qs => [...qs, newQuiz]);
            } else {
              alert("⚠️ Wysłano plik, ale backend zwrócił błąd");
            }
          })
          .catch(err => {
            console.error("Błąd przesyłania pliku:", err);
            alert("❌ Nie udało się wysłać pliku do backendu");
          }));
    }
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
                        style={{ backgroundColor: q.color }}
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
