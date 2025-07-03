package com.example.spring_boot;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

import java.io.InputStreamReader;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.security.MessageDigest;

@RestController
@CrossOrigin(origins = "*")
public class HelloController {

    private final QuizRepository quizRepository;
    private final String recaptchaSecret = "6LckD6EfAAAAAEHzq9XhuBlj_tutx-PlA-KNDa3Q"; // Twój klucz prywatny
    // admin123
    // aby otrzymać hash
    // echo -n "admin123" | openssl dgst -sha256
    private final String deletePasswordHash = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9"; // SHA-256 hash for 'admin123' (hex)

    public HelloController(QuizRepository quizRepository) {
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


    @GetMapping(value = "/quizes/export/{id}", produces = "application/xml")
    public ResponseEntity<String> exportQuizToXml(@PathVariable Long id) {
        return quizRepository.findById(id)
                .map(quiz -> {
                    StringBuilder xml = new StringBuilder();
                    xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
                    xml.append("<quiz>\n");

                    xml.append("  <metadata>\n");
                    xml.append("    <title>").append(escapeXml(quiz.getTitle())).append("</title>\n");
                    xml.append("    <author>").append(escapeXml(quiz.getAuthor())).append("</author>\n");
                    xml.append("    <creationDate>").append(quiz.getCreationDate()).append("</creationDate>\n");
                    xml.append("    <category>").append(quiz.getCategory()).append("</category>\n");

                    xml.append("  </metadata>\n");

                    for (Question question : quiz.getQuestions()) {
                        xml.append("  <question type=\"multichoice\">\n");
                        xml.append("    <questiontext>").append(escapeXml(question.getQuestion())).append("</questiontext>\n");

                        double totalPoints = question.getAnswers().stream()
                                .filter(a -> a.getPointsPerAnswer() > 0)
                                .mapToDouble(Answer::getPointsPerAnswer).sum();

                        xml.append("    <defaultgrade>").append(totalPoints).append("</defaultgrade>\n");

                        for (Answer answer : question.getAnswers()) {
                            double fraction = Math.round((answer.getPointsPerAnswer() / totalPoints) * 10000.0) / 100.0;
                            xml.append("    <answer fraction=\"").append(fraction).append("\">\n");
                            xml.append("      <text>").append(escapeXml(answer.getAnswerText())).append("</text>\n");
                            xml.append("    </answer>\n");
                        }
                        xml.append("  </question>\n");
                    }

                    xml.append("</quiz>\n");

                    return ResponseEntity.ok(xml.toString());
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private String escapeXml(String s) {
        return s == null ? "" : s.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;");
    }

    /**
     * curl -X POST http://localhost:8080/add-quiz \
     * -H "Content-Type: application/json" \
     * -d '{"title":"Test Quiz","author":"User", "category": "prog", "questions":[{"question":"PYTANIE","answers":[{"pointsPerAnswer":1,"answerText":"Odpowiedz","correct":true}],"maxPointsPerQuestion":1},{"question":"PYTANIE","answers":[{"pointsPerAnswer":1,"answerText":"Odpowiedz","correct":true}],"maxPointsPerQuestion":1},{"question":"PYTANIE","answers":[{"pointsPerAnswer":1,"answerText":"Odpowiedz","correct":true}],"maxPointsPerQuestion":1},{"question":"PYTANIE","answers":[{"pointsPerAnswer":1,"answerText":"Odpowiedz","correct":true}],"maxPointsPerQuestion":1},{"question":"PYTANIE","answers":[{"pointsPerAnswer":1,"answerText":"Odpowiedz","correct":true}],"maxPointsPerQuestion":1}]}'
     **/
    @PostMapping("/add-quiz")
    public Quiz addQuiz(@RequestBody Quiz quiz) {
        quiz.setCreationDate(LocalDate.now());
        return quizRepository.save(quiz);
    }

    private String getTextContent(Element parent, String tag) {
        NodeList list = parent.getElementsByTagName(tag);
        if (list.getLength() > 0) {
            return list.item(0).getTextContent().trim();
        }
        return "";
    }


    @PostMapping("/import")
    public ResponseEntity<String> importQuizFromXml(@RequestParam("file") MultipartFile file) {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(file.getInputStream());

            Element metadata = (Element) doc.getElementsByTagName("metadata").item(0);
            String title = getTextContent(metadata, "title");
            String author = getTextContent(metadata, "author");
            String category = getTextContent(metadata, "category");

            NodeList questionNodes = doc.getElementsByTagName("question");
            List<Question> questions = new ArrayList<>();

            for (int i = 0; i < questionNodes.getLength(); i++) {
                Element qElem = (Element) questionNodes.item(i);
                if (!"multichoice".equals(qElem.getAttribute("type"))) continue;

                String questionText = getTextContent(qElem, "questiontext");
                double totalPoints = Double.parseDouble(getTextContent(qElem, "defaultgrade"));

                NodeList answersXml = qElem.getElementsByTagName("answer");
                List<Answer> answers = new ArrayList<>();

                for (int j = 0; j < answersXml.getLength(); j++) {
                    Element aElem = (Element) answersXml.item(j);
                    String aText = getTextContent(aElem, "text");
                    double fraction = Double.parseDouble(aElem.getAttribute("fraction"));
                    double points = Math.round((fraction / 100.0) * totalPoints * 100.0) / 100.0;

                    Answer a = new Answer();
                    a.setAnswerText(aText);
                    a.setCorrect(points > 0);
                    a.setPointsPerAnswer(points);
                    answers.add(a);
                }

                if (!answers.isEmpty()) {
                    Question q = new Question();
                    q.setQuestion(questionText);
                    q.setAnswers(answers);
                    questions.add(q);
                }
            }

            Quiz quiz = new Quiz();
            quiz.setTitle(title);
            quiz.setAuthor(author);
            quiz.setQuestions(questions);
            quiz.setCategory(category);
            quiz.setCreationDate(LocalDate.now());
            quizRepository.save(quiz);

            return ResponseEntity.ok("✅ Zaimportowano quiz: \"" + title + "\" z " + questions.size() + " pytaniami.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("❌ Błąd importu XML: " + e.getMessage());
        }
    }


    // Nowy endpoint POST do usuwania quizu z weryfikacją hasła i recaptcha
    @PostMapping("/delete/{quiz_id}")
    public ResponseEntity<String> deleteQuizWithRecaptcha(@PathVariable("quiz_id") Long quizId, @RequestBody Map<String, String> body) {
        String passwordHash = body.getOrDefault("passwordHash", "");
        String recaptchaToken = body.getOrDefault("recaptchaToken", "");
        if (!deletePasswordHash.equalsIgnoreCase(passwordHash)) {
            return ResponseEntity.status(403).body("Błędne hasło.");
        }
        if (!verifyRecaptcha(recaptchaToken)) {
            return ResponseEntity.status(403).body("Błąd reCAPTCHA.");
        }
        if (quizRepository.existsById(quizId)) {
            quizRepository.deleteById(quizId);
            return ResponseEntity.ok("Quiz usunięty.");
        } else {
            return ResponseEntity.status(404).body("Quiz nie istnieje.");
        }
    }

    private boolean verifyRecaptcha(String token) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://www.google.com/recaptcha/api/siteverify?secret=" + recaptchaSecret + "&response=" + token;
            Map response = restTemplate.postForObject(url, null, Map.class);
            return response != null && Boolean.TRUE.equals(response.get("success"));
        } catch (Exception e) {
            return false;
        }
    }

}
