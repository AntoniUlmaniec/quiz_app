package com.example.spring_boot;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.ArrayList;
import java.util.List;

@RestController
public class HelloController {

    @GetMapping("/")
    public RedirectView redirect() {
        RedirectView redirectView = new RedirectView();
        redirectView.setUrl("http://localhost:8080/swagger-ui/index.html");
        return redirectView;
    }

    @GetMapping("quizes")
    public ArrayList<Quiz> getAllQuizes(){
        ArrayList<Quiz> quizy = new ArrayList<Quiz>();
        quizy.add(new Quiz());
        quizy.add(new Quiz());
        return quizy;
    }

    @GetMapping("/example")
    public Quiz getExampleQuiz() {
        Quiz quiz = new Quiz();
        return quiz; // Spring automatycznie zamieni to na JSON
    }



    @GetMapping("/users")
    public List<String> getUsers() {
        return List.of("User1", "User2");
    }

}
