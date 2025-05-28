import static spark.Spark.*;

import com.google.gson.Gson;

import java.util.*;

public class QuizApp {
    static Gson gson = new Gson();

    // Prosta "baza" quizów i pytań w pamięci
    static List<Quiz> quizzes = new ArrayList<>();

    public static void main(String[] args) {
        port(4000);
        staticFiles.location("/static");

        // Inicjalizacja przykładowych quizów
        initQuizzes();

        // Endpoint GET - pobierz listę quizów
        get("/quizzes", (req, res) -> {
            res.type("application/json");
            return gson.toJson(quizzes);
        });

        // Endpoint POST - dodaj pytanie do quizu (w pamięci)
        post("/quizzes/:quizId/questions", (req, res) -> {
            res.type("application/json");
            int quizId = Integer.parseInt(req.params("quizId"));
            Question newQuestion = gson.fromJson(req.body(), Question.class);

            Quiz quiz = quizzes.stream()
                    .filter(q -> q.getId() == quizId)
                    .findFirst()
                    .orElse(null);

            if (quiz == null) {
                res.status(404);
                return gson.toJson(Map.of("error", "Quiz not found"));
            }

            quiz.getQuestions().add(newQuestion);
            return gson.toJson(newQuestion);
        });
    }

    static void initQuizzes() {
        Quiz quiz1 = new Quiz(1, "Podstawy Javy");
        quiz1.getQuestions().add(new Question("Co oznacza JVM?", Arrays.asList("Java Virtual Machine", "Java Variable Method", "Java Visual Mode"), 0));
        quizzes.add(quiz1);

        Quiz quiz2 = new Quiz(2, "HTML i CSS");
        quiz2.getQuestions().add(new Question("Co to jest CSS?", Arrays.asList("Cascading Style Sheets", "Creative Style System", "Colorful Style Syntax"), 0));
        quizzes.add(quiz2);
    }

    // Proste klasy modelu quizu i pytania
    static class Quiz {
        private int id;
        private String name;
        private List<Question> questions = new ArrayList<>();

        public Quiz(int id, String name) {
            this.id = id;
            this.name = name;
        }

        public int getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public List<Question> getQuestions() {
            return questions;
        }
    }

    static class Question {
        private String questionText;
        private List<String> options;
        private int correctOptionIndex;

        public Question() {
        }

        public Question(String questionText, List<String> options, int correctOptionIndex) {
            this.questionText = questionText;
            this.options = options;
            this.correctOptionIndex = correctOptionIndex;
        }

        public String getQuestionText() {
            return questionText;
        }

        public List<String> getOptions() {
            return options;
        }

        public int getCorrectOptionIndex() {
            return correctOptionIndex;
        }
    }
}
