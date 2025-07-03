// src/Import.js

/**
 * Obsługuje import pliku GIFT poprzez wysłanie go do backendu.
 * Zakłada, że backend odpowiada za walidację i zapis do bazy danych.
 *
 * @param {File} file - Obiekt pliku do zaimportowania.
 * @param {function(string): void} onSuccess - Callback wywoływany po pomyślnym imporcie, otrzymuje wiadomość sukcesu.
 * @param {function(Error): void} onError - Callback wywoływany w przypadku błędu, otrzymuje obiekt Error.
 */
export const importGiftFileToBackend = (file, onSuccess, onError) => {
    if (!file) {
        onError(new Error('Nie wybrano pliku.'));
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetch("http://localhost:8080/import", { // Endpoint dla plików GIFT
        method: "POST",
        body: formData,
    })
        .then(res => {
            if (!res.ok) {
                // Jeśli backend zwróci błąd, odczytujemy wiadomość o błędzie z odpowiedzi
                return res.text().then(text => Promise.reject(new Error(text || res.statusText)));
            }
            return res.text(); // Backend powinien zwrócić tekst sukcesu lub potwierdzenie
        })
        .then(message => {
            onSuccess(message); // Przekazujemy wiadomość o sukcesie do callbacka
        })
        .catch(err => {
            onError(err); // Przekazujemy błąd do callbacka
        });
};