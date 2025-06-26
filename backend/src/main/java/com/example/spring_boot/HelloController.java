package com.example.spring_boot;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
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

    /**
     curl -X POST http://localhost:8080/add-quiz \
     -H "Content-Type: application/json" \
     -d '{"title":"Test Quiz","author":"User", "questions":[{"question":"PYTANIE","answers":[{"pointsPerAnswer":1,"answerText":"Odpowiedz","correct":true}],"maxPointsPerQuestion":1},{"question":"PYTANIE","answers":[{"pointsPerAnswer":1,"answerText":"Odpowiedz","correct":true}],"maxPointsPerQuestion":1},{"question":"PYTANIE","answers":[{"pointsPerAnswer":1,"answerText":"Odpowiedz","correct":true}],"maxPointsPerQuestion":1},{"question":"PYTANIE","answers":[{"pointsPerAnswer":1,"answerText":"Odpowiedz","correct":true}],"maxPointsPerQuestion":1},{"question":"PYTANIE","answers":[{"pointsPerAnswer":1,"answerText":"Odpowiedz","correct":true}],"maxPointsPerQuestion":1}]}'
     **/
    @PostMapping("/add-quiz")
    public Quiz addQuiz(@RequestBody Quiz quiz) {
        quiz.setCreationDate(LocalDate.now());
        return quizRepository.save(quiz);
    }

}
