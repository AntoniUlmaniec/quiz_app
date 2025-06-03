package com.example.spring_boot;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class HelloController {

    @GetMapping("/")
    public String index() {
        return "Swagger UI: dostępny jest na stronie http://localhost:8080/swagger-ui/index.html \n http://localhost:8080/v3/api-docs";
    }

    @GetMapping("/test")
    public String index2() {
        return "test!";
    }

    @GetMapping("/users")
    public List<String> getUsers() {
        return List.of("User1", "User2");
    }

}
