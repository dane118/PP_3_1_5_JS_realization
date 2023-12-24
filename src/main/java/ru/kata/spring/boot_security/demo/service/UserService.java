package ru.kata.spring.boot_security.demo.service;


import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserService {
    List<User> getAllUsers();

    void addOrUpdateUser(User user);

    void deleteUser(User user);

    User getById(Long id);

    User getUserByEmail(String email);

}
