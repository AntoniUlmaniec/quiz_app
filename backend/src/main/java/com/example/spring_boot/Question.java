package com.example.spring_boot;
import jakarta.persistence.Entity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class Question {
    private String question;
    private ArrayList<Answer> answers = new ArrayList<Answer>();

    public Question(String question, ArrayList<Answer> answers) {
        this.question = question;
        this.answers = answers;
    }

    public int getMaxSumaPunktowZaPytanie(){
        int wynik = 0;
        for (Answer answer : answers) {
            if(answer.czyPrawdziwe){
                wynik += answer.liczbaPunktowZaOdpowiedz;
            }
        }
        return wynik;
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
