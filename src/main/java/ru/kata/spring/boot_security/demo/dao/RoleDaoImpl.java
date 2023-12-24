package ru.kata.spring.boot_security.demo.dao;

import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.model.Role;

import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;
import java.util.List;

@Repository
public class RoleDaoImpl implements RoleDao {
    private final EntityManager entityManager;

    public RoleDaoImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<Role> getAllRoles() {
        return entityManager.createQuery("from Role").getResultList();
    }

    @Override
    public Role getById(Long id) {
        Role role = entityManager.find(Role.class, id);
        if (role == null) {
            throw new EntityNotFoundException();
        } else {
            return role;
        }
    }

    @Override
    public void deleteRole(Role role) {
        if (!entityManager.contains(role)) {
            throw new EntityNotFoundException();
        } else {
            entityManager.remove(role);
        }
    }

    @Override
    public void updateRole(Role role) {
        Role roleCheck = entityManager.find(Role.class, role.getId());
        if (roleCheck == null) {
            throw new EntityNotFoundException();
        } else {
            entityManager.merge(role);
        }
    }

    @Override
    public void addNewRole(Role role) {
        entityManager.persist(role);
    }
}