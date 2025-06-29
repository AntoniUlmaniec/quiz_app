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
    @PostMapping("/import")
    public ResponseEntity<String> importGiftFile(@RequestParam("file") MultipartFile file) {
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }

            System.out.println("📥 Odebrano plik .gift \n" );

            return ResponseEntity.ok("Plik odebrany");  // 💡 kod 200 OK
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Błąd serwera");  // 👈 zapasowe
        }
    }

}
