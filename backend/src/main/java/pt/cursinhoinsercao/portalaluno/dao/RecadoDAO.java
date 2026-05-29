package pt.cursinhoinsercao.portalaluno.dao;

import pt.cursinhoinsercao.portalaluno.entity.Recado;
import pt.cursinhoinsercao.portalaluno.util.JPAUtil;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.List;

public class RecadoDAO {

    public void salvar(Recado recado) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(recado);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public Recado buscarPorId(int id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.find(Recado.class, id);
        } finally {
            em.close();
        }
    }

    public List<Recado> buscarTodos() {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<Recado> query = em.createQuery("SELECT r FROM Recado r ORDER BY r.data DESC", Recado.class);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public void atualizar(Recado recado) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.merge(recado);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public void remover(int id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            Recado recado = em.find(Recado.class, id);
            if (recado != null) {
                em.remove(recado);
            }
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public int contarTodos() {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<Long> query = em.createQuery("SELECT COUNT(r) FROM Recado r", Long.class);
            return query.getSingleResult().intValue();
        } finally {
            em.close();
        }
    }
}
