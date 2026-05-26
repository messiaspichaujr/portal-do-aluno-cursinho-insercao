package pt.cursinhoinsercao.portalaluno.dao;

import pt.cursinhoinsercao.portalaluno.entity.DisciplinaAluno;
import pt.cursinhoinsercao.portalaluno.util.JPAUtil;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.List;

public class DisciplinaAlunoDAO {

    public void salvar(DisciplinaAluno da) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(da);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public List<DisciplinaAluno> buscarPorDisciplina(int disciplinaId) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<DisciplinaAluno> query = em.createQuery(
                "SELECT da FROM DisciplinaAluno da WHERE da.disciplina = :disciplinaId", DisciplinaAluno.class);
            query.setParameter("disciplinaId", disciplinaId);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public List<DisciplinaAluno> buscarPorAluno(int alunoId) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<DisciplinaAluno> query = em.createQuery(
                "SELECT da FROM DisciplinaAluno da WHERE da.aluno = :alunoId", DisciplinaAluno.class);
            query.setParameter("alunoId", alunoId);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public DisciplinaAluno buscarPorAlunoEDisciplina(int alunoId, int disciplinaId) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<DisciplinaAluno> query = em.createQuery(
                "SELECT da FROM DisciplinaAluno da WHERE da.aluno = :alunoId AND da.disciplina = :disciplinaId",
                DisciplinaAluno.class);
            query.setParameter("alunoId", alunoId);
            query.setParameter("disciplinaId", disciplinaId);
            List<DisciplinaAluno> results = query.getResultList();
            return results.isEmpty() ? null : results.get(0);
        } finally {
            em.close();
        }
    }

    public List<DisciplinaAluno> buscarTodos() {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<DisciplinaAluno> query = em.createQuery("SELECT da FROM DisciplinaAluno da", DisciplinaAluno.class);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public void remover(int id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            DisciplinaAluno da = em.find(DisciplinaAluno.class, id);
            if (da != null) {
                em.remove(da);
            }
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }
}
