package com.example.spring_boot;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String question;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "question_id")
    private List<Answer> answers = new ArrayList<>();

    public Question() {
        // no-arg constructor required by JPA
    }

    public Question(String question, List<Answer> answers) {
        this.question = question;
        this.answers = answers;
    }

    public double getMaxPointsPerQuestion() {
        double points = 0;
        for (Answer answer : answers) {
            if (answer.isCorrect) {
                points += answer.pointsPerAnswer;
            }
        }
        return points;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public List<Answer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }
}
