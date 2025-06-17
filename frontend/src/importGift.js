// src/importGift.js

export const importGiftFile = (file, callback) => {
    const reader = new FileReader();

    reader.onload = function(event) {
        const content = event.target.result;
        const parsedQuiz = parseGIFT(content);
        callback(parsedQuiz);  // Wywołaj callback z danymi quizu
    };

    reader.readAsText(file);
};

const parseGIFT = (content) => {
    const quiz = { title: '', questions: [] };
    const lines = content.split('\n');
    let currentQuestion = null;

    lines.forEach((line) => {
        if (line.startsWith('::')) {
            quiz.title = line.split('::')[1].trim();
        } else if (line.includes('{')) {
            currentQuestion = { text: line.replace('{', '').trim(), answers: [] };
        } else if (line.includes('=') || line.includes('~')) {
            currentQuestion.answers.push({ text: line.trim(), correct: line.startsWith('=') });
        } else if (line.includes('}')) {
            quiz.questions.push(currentQuestion);
            currentQuestion = null;
        }
    });

    return quiz;
};
