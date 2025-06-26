package com.example.spring_boot;

public class Answer {
    int pointsPerAnswer;
    boolean isCorrect;
    String answerText;

    public Answer(int pointsPerAnswer, boolean isCorrect, String answerText) {
        this.pointsPerAnswer = pointsPerAnswer;
        this.isCorrect = isCorrect;
        this.answerText = answerText;
    }

    public int getPointsPerAnswer() {
        return pointsPerAnswer;
    }

    public void setPointsPerAnswer(int pointsPerAnswer) {
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
