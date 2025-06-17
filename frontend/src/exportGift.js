// src/exportGift.js

import { saveAs } from 'file-saver'; // importujemy bibliotekę do zapisu plików

// // Funkcja eksportu do pliku GIFT
// export const exportQuizToGIFT = (quizData) => {
//     let giftFileContent = `::${quizData.title}::\n`;  // Nagłówek quizu
//     quizData.questions.forEach((question) => {
//         giftFileContent += question.text + " {\n";
//         question.answers.forEach((answer) => {
//             giftFileContent += answer.correct ? `= ${answer.text}\n` : `~ ${answer.text}\n`;
//         });
//         giftFileContent += "}\n\n";
//     });
//
//     const blob = new Blob([giftFileContent], { type: 'text/plain;charset=utf-8' });
//     saveAs(blob, `${quizData.title}.gift`);
// };

/ Funkcja, która używa backendu zamiast lokalnego eksportu
export const exportQuizToGIFT = (quizData) => {
    // ... (Twój kod generujący plik lokalnie) ...
};

// nowa funkcja eksportu przez backend
export async function exportQuizViaBackend(quizData) {
    const res = await fetch('/api/export-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData),//
    });
    if (!res.ok) {
        console.error('Błąd podczas eksportu przez backend');
        return;
    }
    const blob = await res.blob();
    const disposition = res.headers.get('content-disposition');
    const filename = disposition
            ?.split('filename=')[1]
            ?.replace(/"/g, '')
        || `${quizData.title}.gift`;

    saveAs(blob, filename);
}
