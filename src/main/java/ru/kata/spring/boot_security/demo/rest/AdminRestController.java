package ru.kata.spring.boot_security.demo.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;

@RestController
@RequestMapping("api/admin")
public class AdminRestController {
    private final UserService userService;

    public AdminRestController(UserService service) {
        this.userService = service;
    }

    @GetMapping("/")
    public ResponseEntity<List<User>> showAllUsers() {
         return  ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
        User user = userService.getById(id);
        if (user == null) {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping("/")
    public ResponseEntity<User> createNewUser(@RequestBody User user) {
        userService.addOrUpdateUser(user);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/")
    public ResponseEntity<HttpStatus> updateUser(@RequestBody User user) {
        userService.addOrUpdateUser(user);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable(name = "id") Long id) {
        User user = userService.getById(id);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(String.format("User with id = %d not found.", id));
        }
        userService.deleteUser(user);
        return ResponseEntity.ok(String.format("User with id = %d was deleted. ", id));
    }
}