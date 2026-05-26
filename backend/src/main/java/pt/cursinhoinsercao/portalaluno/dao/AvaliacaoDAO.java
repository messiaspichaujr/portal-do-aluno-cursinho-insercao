package pt.cursinhoinsercao.portalaluno.dao;

import pt.cursinhoinsercao.portalaluno.entity.Avaliacao;
import pt.cursinhoinsercao.portalaluno.util.JPAUtil;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.List;

public class AvaliacaoDAO {

    public void salvar(Avaliacao avaliacao) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(avaliacao);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public Avaliacao buscarPorId(int id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.find(Avaliacao.class, id);
        } finally {
            em.close();
        }
    }

    public List<Avaliacao> buscarTodos() {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<Avaliacao> query = em.createQuery("SELECT a FROM Avaliacao a", Avaliacao.class);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public void atualizar(Avaliacao avaliacao) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.merge(avaliacao);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public void remover(int id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            Avaliacao avaliacao = em.find(Avaliacao.class, id);
            if (avaliacao != null) {
                em.remove(avaliacao);
            }
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }
}
