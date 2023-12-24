package ru.kata.spring.boot_security.demo.dao;

import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.model.User;

import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;
import javax.persistence.Query;
import java.util.List;

@Repository
public class UserDaoImpl implements UserDao {
    private final EntityManager entityManager;

    public UserDaoImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<User> getAllUsers() {
        return entityManager.createQuery("from User").getResultList();
    }

    @Override
    public void addNewUser(User user) {
        entityManager.persist(user);
    }

    @Override
    public void updateUser(User user) {
        User userCheck = entityManager.find(User.class, user.getId());
        if (userCheck == null) {
            throw new EntityNotFoundException();
        } else {
            entityManager.merge(user);
        }
    }

    @Override
    public User getById(Long id) {
        User user = entityManager.find(User.class, id);
        if (user == null) {
            throw new EntityNotFoundException();
        } else {
            return user;
        }
    }

    @Override
    public User getUserByEmail(String email) {
        Query query = entityManager
                .createQuery("from User u join fetch u.roles where u.email =:user_email")
                .setParameter("user_email", email);
        User user = (User) query.getSingleResult();
        if (user == null) {
            throw new EntityNotFoundException();
        } else {
            return user;
        }
    }

    @Override
    public void deleteUser(User user) {
        if (!entityManager.contains(user)) {
            throw new EntityNotFoundException();
        } else {
            entityManager.remove(user);
        }
    }
}
