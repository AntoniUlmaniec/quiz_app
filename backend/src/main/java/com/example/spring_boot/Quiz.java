package com.example.spring_boot;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;


public class Quiz {
    private int id;
    private String title;
    private ArrayList<Question> questions = new ArrayList<Question>();

    private String author;
    private LocalDate creationDate;

    public Quiz(){
        this.title = "";
        this.author = "";
        this.creationDate = LocalDate.now();
        this.questions = new ArrayList<Question>();
        ArrayList<Answer> odpwoeidzi = new ArrayList<>();
        odpwoeidzi.add(new Answer("Odpowiedzi", true, 1) );
        questions.add(new Question("PYTANIE", odpwoeidzi));
        questions.add(new Question("PYTANIE", odpwoeidzi));
        questions.add(new Question("PYTANIE", odpwoeidzi));
        questions.add(new Question("PYTANIE", odpwoeidzi));
        questions.add(new Question("PYTANIE", odpwoeidzi));

    }

    public int getId() {
        return id;
    }

    public int getSumaMaxPunktowWQuiziue(){
        int wynik = 0;
        for (Question question : questions) {
            wynik += question.getMaxSumaPunktowZaPytanie();
        }
        return wynik;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public ArrayList<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(ArrayList<Question> questions) {
        this.questions = questions;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }
}
