package pt.cursinhoinsercao.portalaluno.dao;

import pt.cursinhoinsercao.portalaluno.entity.Disciplina;
import pt.cursinhoinsercao.portalaluno.util.JPAUtil;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.List;

public class DisciplinaDAO {

    public void salvar(Disciplina disciplina) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(disciplina);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public Disciplina buscarPorId(int id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.find(Disciplina.class, id);
        } finally {
            em.close();
        }
    }

    public List<Disciplina> buscarTodos() {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<Disciplina> query = em.createQuery("SELECT d FROM Disciplina d", Disciplina.class);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public void atualizar(Disciplina disciplina) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.merge(disciplina);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public void remover(int id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            Disciplina disciplina = em.find(Disciplina.class, id);
            if (disciplina != null) {
                em.remove(disciplina);
            }
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }
}
