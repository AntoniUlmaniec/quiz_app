// src/exportGift.js

import { saveAs } from 'file-saver'; // importujemy bibliotekę do zapisu plików


// nowa funkcja eksportu przez backend
export async function exportQuizViaBackend(quizData) {
    const res = await fetch('/export-quiz', {
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
