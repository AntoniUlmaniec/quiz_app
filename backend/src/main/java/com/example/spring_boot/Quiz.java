package com.example.spring_boot;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String author;
    private String title;
    private LocalDate creationDate;
    private String category;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "quiz_id")
    private List<Question> questions = new ArrayList<>();


    public Quiz(Long id, String author, String title, LocalDate creationDate, String category, List<Question> questions) {
        this.id = id;
        this.author = author;
        this.title = title;
        this.creationDate = creationDate;
        this.questions = questions;
        this.category = category;
    }


    public Quiz() {
        this.title = "";
        this.author = "";
        this.creationDate = LocalDate.now();
    }

    public double getMaxPointsPerQuiz() {
        double points = 0;
        for (Question question : questions) {
            points += question.getMaxPointsPerQuestion();
        }
        return points;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
