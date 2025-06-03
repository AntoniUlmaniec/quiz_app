package com.example.spring_boot;

public class Answer {
    int liczbaPunktowZaOdpowiedz;
    boolean czyPrawdziwe;
    String answer;

    public Answer(String answer, boolean czyPrawdziwe, int liczbaPunktowZaOdpowiedz) {
        this.answer = answer;
        this.czyPrawdziwe = czyPrawdziwe;
        this.liczbaPunktowZaOdpowiedz = liczbaPunktowZaOdpowiedz;
    }


    public int getLiczbaPunktowZaOdpowiedz() {
        return liczbaPunktowZaOdpowiedz;
    }
    public void setLiczbaPunktowZaOdpowiedz(int liczbaPunktowZaOdpowiedz) {
        this.liczbaPunktowZaOdpowiedz = liczbaPunktowZaOdpowiedz;
    }
    public void setAnswer(String answer) {
        this.answer = answer;
    }
    public void setCzyPrawdziwe(boolean czyPrawdziwe) {
        this.czyPrawdziwe = czyPrawdziwe;
    }
    public String getAnswer() {
        return answer;
    }
    public boolean isCzyPrawdziwe() {
        return czyPrawdziwe;
    }
}
