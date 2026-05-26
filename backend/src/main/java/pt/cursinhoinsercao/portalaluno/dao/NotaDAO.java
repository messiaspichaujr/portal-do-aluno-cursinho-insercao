package pt.cursinhoinsercao.portalaluno.dao;

import pt.cursinhoinsercao.portalaluno.entity.Nota;
import pt.cursinhoinsercao.portalaluno.util.JPAUtil;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.List;

public class NotaDAO {

    public void salvar(Nota nota) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(nota);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public Nota buscarPorId(int id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.find(Nota.class, id);
        } finally {
            em.close();
        }
    }

    public List<Nota> buscarPorAluno(int alunoId) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<Nota> query = em.createQuery("SELECT n FROM Nota n WHERE n.aluno = :alunoId", Nota.class);
            query.setParameter("alunoId", alunoId);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public List<Nota> buscarPorAvaliacao(int avaliacaoId) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<Nota> query = em.createQuery("SELECT n FROM Nota n WHERE n.avaliacao = :avaliacaoId", Nota.class);
            query.setParameter("avaliacaoId", avaliacaoId);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public Nota buscarPorAlunoEAvaliacao(int alunoId, int avaliacaoId) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<Nota> query = em.createQuery(
                "SELECT n FROM Nota n WHERE n.aluno = :alunoId AND n.avaliacao = :avaliacaoId", Nota.class);
            query.setParameter("alunoId", alunoId);
            query.setParameter("avaliacaoId", avaliacaoId);
            return query.getResultStream().findFirst().orElse(null);
        } finally {
            em.close();
        }
    }

    public List<Nota> buscarTodos() {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<Nota> query = em.createQuery("SELECT n FROM Nota n", Nota.class);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public void atualizar(Nota nota) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.merge(nota);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public void remover(int id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            Nota nota = em.find(Nota.class, id);
            if (nota != null) {
                em.remove(nota);
            }
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }
}
