const quizListDiv = document.getElementById('quizList');
const quizPlayDiv = document.getElementById('quizPlay');
const quizTitle = document.getElementById('quizTitle');
const questionsContainer = document.getElementById('questionsContainer');
const backBtn = document.getElementById('backBtn');
const addQuestionForm = document.getElementById('addQuestionForm');

let quizzes = [];

function fetchQuizzes() {
    fetch('/quizzes')
        .then(res => res.json())
        .then(data => {
            quizzes = data;
            showQuizList();
        });
}

function showQuizList() {
    quizPlayDiv.classList.add('d-none');
    quizListDiv.innerHTML = '<h2>Dostępne quizy:</h2>';
    quizzes.forEach(q => {
        const div = document.createElement('div');
        div.classList.add('border', 'p-3', 'mb-2', 'bg-light', 'rounded');
        div.textContent = `${q.id}: ${q.name}`;
        div.style.cursor = 'pointer';
        div.onclick = () => playQuiz(q.id);
        quizListDiv.appendChild(div);
    });
    quizListDiv.classList.remove('d-none');
}

function playQuiz(quizId) {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return;

    quizTitle.textContent = quiz.name;
    questionsContainer.innerHTML = '';

    quiz.questions.forEach((q, i) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('mb-4');

        const qText = document.createElement('p');
        qText.innerHTML = `<strong>${i + 1}. ${q.questionText}</strong>`;
        questionDiv.appendChild(qText);

        const ul = document.createElement('ul');
        ul.classList.add('list-group');

        q.options.forEach(opt => {
            const li = document.createElement('li');
            li.textContent = opt;
            li.classList.add('list-group-item');
            ul.appendChild(li);
        });

        questionDiv.appendChild(ul);
        questionsContainer.appendChild(questionDiv);
    });

    quizListDiv.classList.add('d-none');
    quizPlayDiv.classList.remove('d-none');
}

backBtn.onclick = () => {
    quizPlayDiv.classList.add('d-none');
    quizListDiv.classList.remove('d-none');
};

addQuestionForm.onsubmit = (e) => {
    e.preventDefault();

    const quizId = parseInt(document.getElementById('quizId').value);
    const questionText = document.getElementById('questionText').value;
    const options = [
        document.getElementById('option1').value,
        document.getElementById('option2').value,
        document.getElementById('option3').value
    ];
    const correctOptionIndex = parseInt(document.getElementById('correctOption').value);

    const newQuestion = {
        questionText,
        options,
        correctOptionIndex
    };

    fetch(`/quizzes/${quizId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuestion)
    })
    .then(res => {
        if (res.ok) {
            alert('Pytanie dodane!');
            addQuestionForm.reset();
            fetchQuizzes();
        } else {
            res.json().then(data => alert('Błąd: ' + (data.error || 'Nieznany błąd')));
        }
    })
    .catch(() => alert('Błąd połączenia z serwerem.'));
};

fetchQuizzes();
