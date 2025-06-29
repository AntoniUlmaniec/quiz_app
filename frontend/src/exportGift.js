// src/exportGift.js


// src/exportGift.js

import { saveAs } from 'file-saver';

// Export quiz as .txt file from backend
export async function exportQuizViaBackend(q) {

    const quizTitle = 'quiz'

    const res = await fetch(`http://localhost:8080/quizes/export/${q.id}`, {
        method: 'GET',
    });
    if (!res.ok) {
        console.error('Error exporting quiz from backend');
        return;
    }
    const blob = await res.blob();
    // Always use .txt extension
    const filename = `${q.title}.gift`;
    saveAs(blob, filename);
}