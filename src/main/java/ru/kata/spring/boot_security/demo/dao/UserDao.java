package ru.kata.spring.boot_security.demo.dao;


import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserDao {

    List<User> getAllUsers();

    User getById(Long id);

    User getUserByEmail(String email);

    void deleteUser(User user);

    void updateUser(User user);

    void addNewUser(User user);
}
