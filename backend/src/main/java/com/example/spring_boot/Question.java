package com.example.spring_boot;

import java.util.ArrayList;


public class Question {
    private String question;
    private ArrayList<Answer> answers = new ArrayList<Answer>();

    public Question(String question, ArrayList<Answer> answers) {
        this.question = question;
        this.answers = answers;
    }

    public int getMaxPointsPerQuestion() {
        int points = 0;
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

    public ArrayList<Answer> getAnswers() {
        return answers;
    }

    public void setAnswers(ArrayList<Answer> answers) {
        this.answers = answers;
    }
}
