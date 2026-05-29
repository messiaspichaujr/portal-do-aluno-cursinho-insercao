package pt.cursinhoinsercao.portalaluno.dao;

import pt.cursinhoinsercao.portalaluno.entity.Frequencia;
import pt.cursinhoinsercao.portalaluno.util.JPAUtil;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.time.LocalDateTime;
import java.util.List;

public class FrequenciaDAO {

    public void salvar(Frequencia frequencia) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(frequencia);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public Frequencia buscarPorId(int id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.find(Frequencia.class, id);
        } finally {
            em.close();
        }
    }

    public List<Frequencia> buscarPorAluno(int alunoId) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<Frequencia> query = em.createQuery(
                "SELECT f FROM Frequencia f WHERE f.aluno = :alunoId ORDER BY f.data DESC", Frequencia.class);
            query.setParameter("alunoId", alunoId);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public List<Frequencia> buscarPorData(LocalDateTime data) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<Frequencia> query = em.createQuery(
                "SELECT f FROM Frequencia f WHERE f.data = :data", Frequencia.class);
            query.setParameter("data", data);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public List<Frequencia> buscarTodos() {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<Frequencia> query = em.createQuery("SELECT f FROM Frequencia f ORDER BY f.data DESC", Frequencia.class);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public List<Frequencia> buscarPorDisciplina(int disciplinaId) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<Frequencia> query = em.createQuery(
                "SELECT f FROM Frequencia f WHERE f.disciplina = :disciplinaId ORDER BY f.data DESC", Frequencia.class);
            query.setParameter("disciplinaId", disciplinaId);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public List<Frequencia> buscarPorAlunoEDisciplina(int alunoId, int disciplinaId) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<Frequencia> query = em.createQuery(
                "SELECT f FROM Frequencia f WHERE f.aluno = :alunoId AND f.disciplina = :disciplinaId ORDER BY f.data DESC",
                Frequencia.class);
            query.setParameter("alunoId", alunoId);
            query.setParameter("disciplinaId", disciplinaId);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public void remover(int id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            Frequencia frequencia = em.find(Frequencia.class, id);
            if (frequencia != null) {
                em.remove(frequencia);
            }
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public int contarPorAluno(int alunoId) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<Long> query = em.createQuery(
                "SELECT COUNT(f) FROM Frequencia f WHERE f.aluno = :alunoId", Long.class);
            query.setParameter("alunoId", alunoId);
            return query.getSingleResult().intValue();
        } finally {
            em.close();
        }
    }

    public void removerPorAluno(int alunoId) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            TypedQuery<Frequencia> query = em.createQuery(
                "SELECT f FROM Frequencia f WHERE f.aluno = :alunoId", Frequencia.class);
            query.setParameter("alunoId", alunoId);
            List<Frequencia> lista = query.getResultList();
            for (Frequencia f : lista) {
                em.remove(f);
            }
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }
}
