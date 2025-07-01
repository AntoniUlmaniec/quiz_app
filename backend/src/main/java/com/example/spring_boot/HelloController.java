package com.example.spring_boot;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

import java.io.InputStreamReader;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class HelloController {

    private final QuizRepository quizRepository;

    public HelloController(QuizRepository quizRepository) {
        // Konstruktor, który wstrzykuje zależność QuizRepository
        // Dzięki temu możemy korzystać z metod repozytorium do operacji na bazie danych
        this.quizRepository = quizRepository;
    }


    @GetMapping("/")
    public RedirectView redirect() {
        RedirectView redirectView = new RedirectView();
        redirectView.setUrl("http://localhost:8080/swagger-ui/index.html");
        return redirectView;
    }


    @GetMapping("/example")
    public Quiz getExampleQuiz() {
        Quiz quiz = new Quiz();
        return quiz; // Spring automatycznie zamieni to na JSON
    }

    @GetMapping("/quizes")
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    @GetMapping("/quizes/{id}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable Long id) {
        return quizRepository.findById(id)
                .map(quiz -> ResponseEntity.ok(quiz))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/quizes/export/{id}")
    public ResponseEntity<String> exportQuiz(@PathVariable Long id) {
        return quizRepository.findById(id)
                .map(quiz -> {
                    StringBuilder gift = new StringBuilder();
                    for (Question question : quiz.getQuestions()) {
                        gift.append("// ").append(quiz.getTitle()).append("\n");
                        gift.append(question.getQuestion()).append(" {");
                        for (Answer answer : question.getAnswers()) {
                            if (answer.isCorrect()) {
                                gift.append(" =").append(answer.getAnswerText());
                            } else {
                                gift.append(" ~").append(answer.getAnswerText());
                            }
                        }
                        gift.append(" }\n\n");
                    }
                    return ResponseEntity.ok(gift.toString());
                })
                .orElse(ResponseEntity.notFound().build());
    }
    /**
     curl -X POST http://localhost:8080/add-quiz \
     -H "Content-Type: application/json" \
     -d '{"title":"Test Quiz","author":"User", "category": "prog", "questions":[{"question":"PYTANIE","answers":[{"pointsPerAnswer":1,"answerText":"Odpowiedz","correct":true}],"maxPointsPerQuestion":1},{"question":"PYTANIE","answers":[{"pointsPerAnswer":1,"answerText":"Odpowiedz","correct":true}],"maxPointsPerQuestion":1},{"question":"PYTANIE","answers":[{"pointsPerAnswer":1,"answerText":"Odpowiedz","correct":true}],"maxPointsPerQuestion":1},{"question":"PYTANIE","answers":[{"pointsPerAnswer":1,"answerText":"Odpowiedz","correct":true}],"maxPointsPerQuestion":1},{"question":"PYTANIE","answers":[{"pointsPerAnswer":1,"answerText":"Odpowiedz","correct":true}],"maxPointsPerQuestion":1}]}'
     **/
    @PostMapping("/add-quiz")
    public Quiz addQuiz(@RequestBody Quiz quiz) {
        quiz.setCreationDate(LocalDate.now());
        return quizRepository.save(quiz);
    }

    // Java
    @PostMapping("/import")
    public ResponseEntity<String> importGiftFile(@RequestParam("file") MultipartFile file) {
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
            String line;
            List<Question> questions = new ArrayList<>();
            String title = "Imported Quiz";
            String questionText = null;
            List<Answer> answers = null;
            boolean inQuestion = false;

            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty() || line.startsWith("//")) continue;

                // Start of a question
                if (!inQuestion && line.contains("{")) {
                    int idx = line.indexOf("{");
                    questionText = line.substring(0, idx).trim();
                    answers = new ArrayList<>();
                    String answerBlock = line.substring(idx + 1);
                    if (answerBlock.contains("}")) {
                        answerBlock = answerBlock.substring(0, answerBlock.indexOf("}"));
                        inQuestion = false;
                    } else {
                        inQuestion = true;
                    }
                    parseGiftAnswers(answerBlock, answers);
                } else if (inQuestion) {
                    String answerBlock = line;
                    if (answerBlock.contains("}")) {
                        answerBlock = answerBlock.substring(0, answerBlock.indexOf("}"));
                        inQuestion = false;
                    }
                    parseGiftAnswers(answerBlock, answers);
                }

                // End of question
                if (!inQuestion && questionText != null && answers != null && !answers.isEmpty()) {
                    long correctCount = answers.stream().filter(Answer::isCorrect).count();
                    if (correctCount >= 1) { // Only MC and MC with multiple correct
                        Question q = new Question();
                        q.setQuestion(questionText);
                        q.setAnswers(answers);
                        questions.add(q);
                    }
                    questionText = null;
                    answers = null;
                }
            }

            if (questions.isEmpty()) {
                return ResponseEntity.badRequest().body("No valid multiple choice questions found.");
            }

            Quiz quiz = new Quiz();
            quiz.setTitle(title);
            quiz.setQuestions(questions);
            quiz.setCreationDate(LocalDate.now());
            quizRepository.save(quiz);

            return ResponseEntity.ok("Quiz imported with " + questions.size() + " questions.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Server error");
        }
    }

    // Helper method to parse GIFT answers
    private void parseGiftAnswers(String answerBlock, List<Answer> answers) {
        String[] parts = answerBlock.split("(?=[=~])");
        for (String part : parts) {
            part = part.trim();
            if (part.isEmpty()) continue;
            boolean correct = part.startsWith("=");
            String text = part.substring(1).trim();
            if (!text.isEmpty()) {
                Answer a = new Answer();
                a.setAnswerText(text);
                a.setCorrect(correct);
                answers.add(a);
            }
        }
    }


    // usuwanie quizu
    // curl -X DELETE http://localhost:8080/delete/1
    @DeleteMapping("/delete/{quiz_id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable("quiz_id") Long quizId) {
        if (quizRepository.existsById(quizId)) {
            quizRepository.deleteById(quizId);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
