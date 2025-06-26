package com.example.spring_boot;

import java.time.LocalDate;
import java.util.ArrayList;


public class Quiz {
    private int id;
    private String author;
    private String title;
    private LocalDate creationDate;
    private ArrayList<Question> questions = new ArrayList<Question>();

    public Quiz(int id, String author, String title, LocalDate creationDate, ArrayList<Question> questions) {
        this.id = id;
        this.author = author;
        this.title = title;
        this.creationDate = creationDate;
        this.questions = questions;
    }

    public Quiz() {
        this.title = "";
        this.author = "";
        this.creationDate = LocalDate.now();
        this.questions = new ArrayList<Question>();
        ArrayList<Answer> odpwoeidzi = new ArrayList<>();
        odpwoeidzi.add(new Answer(1, true, "Odpowiedz"));
        questions.add(new Question("PYTANIE", odpwoeidzi));
        questions.add(new Question("PYTANIE", odpwoeidzi));
        questions.add(new Question("PYTANIE", odpwoeidzi));
        questions.add(new Question("PYTANIE", odpwoeidzi));
        questions.add(new Question("PYTANIE", odpwoeidzi));

    }

    public int getMaxPointsPerQuiz() {
        int points = 0;
        for (Question question : questions) {
            points += question.getMaxPointsPerQuestion();
        }
        return points;
    }

    public int getId() {
        return id;
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
