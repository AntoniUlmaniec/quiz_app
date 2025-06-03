package com.example.spring_boot;

import java.util.ArrayList;

public class Quiz {
    String question;
    ArrayList<String> answers = new ArrayList<String>();
    public void Quiz(String question, ArrayList<String> answers) {
        this.question = question;
        this.answers = answers;
    }

}
