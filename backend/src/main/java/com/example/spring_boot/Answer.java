package com.example.spring_boot;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


@Entity
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    double pointsPerAnswer;
    boolean isCorrect;
    String answerText;

    public Answer() {
        // no-arg constructor required by JPA
    }

    public Answer(double pointsPerAnswer, boolean isCorrect, String answerText) {
        this.pointsPerAnswer = pointsPerAnswer;
        this.isCorrect = isCorrect;
        this.answerText = answerText;
    }

    public Long getId() {
        return id;
    }

    public double getPointsPerAnswer() {
        return pointsPerAnswer;
    }

    public void setPointsPerAnswer(double pointsPerAnswer) {
        this.pointsPerAnswer = pointsPerAnswer;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(boolean correct) {
        isCorrect = correct;
    }

    public String getAnswerText() {
        return answerText;
    }

    public void setAnswerText(String answerText) {
        this.answerText = answerText;
    }

}
