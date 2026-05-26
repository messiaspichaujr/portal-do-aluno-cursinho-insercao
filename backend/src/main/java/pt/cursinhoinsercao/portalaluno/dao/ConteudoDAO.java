package pt.cursinhoinsercao.portalaluno.dao;

import pt.cursinhoinsercao.portalaluno.entity.Conteudo;
import pt.cursinhoinsercao.portalaluno.util.JPAUtil;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.List;

public class ConteudoDAO {

    public void salvar(Conteudo conteudo) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(conteudo);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public Conteudo buscarPorId(int id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.find(Conteudo.class, id);
        } finally {
            em.close();
        }
    }

    public List<Conteudo> buscarTodos() {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<Conteudo> query = em.createQuery("SELECT c FROM Conteudo c", Conteudo.class);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public List<Conteudo> buscarPorDisciplina(int disciplinaId) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<Conteudo> query = em.createQuery(
                "SELECT c FROM Conteudo c WHERE c.disciplina = :disciplinaId", Conteudo.class);
            query.setParameter("disciplinaId", disciplinaId);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public void atualizar(Conteudo conteudo) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.merge(conteudo);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public void remover(int id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            Conteudo conteudo = em.find(Conteudo.class, id);
            if (conteudo != null) {
                em.remove(conteudo);
            }
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }
}
