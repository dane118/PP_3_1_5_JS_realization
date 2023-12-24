package ru.kata.spring.boot_security.demo.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.model.User;

@RestController
@RequestMapping("api/user")
public class UserRestController {

    @GetMapping("/")
    public ResponseEntity<User> getAuthUser() {
        return ResponseEntity.ok((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
    }
}