package pt.cursinhoinsercao.portalaluno.dao;

import pt.cursinhoinsercao.portalaluno.entity.DisciplinaProf;
import pt.cursinhoinsercao.portalaluno.util.JPAUtil;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.List;

public class DisciplinaProfDAO {

    public void salvar(DisciplinaProf dp) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(dp);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public List<DisciplinaProf> buscarPorProfessor(int profId) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<DisciplinaProf> query = em.createQuery(
                "SELECT dp FROM DisciplinaProf dp WHERE dp.prof = :profId", DisciplinaProf.class);
            query.setParameter("profId", profId);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public List<DisciplinaProf> buscarPorDisciplina(int disciplinaId) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<DisciplinaProf> query = em.createQuery(
                "SELECT dp FROM DisciplinaProf dp WHERE dp.disciplina = :disciplinaId", DisciplinaProf.class);
            query.setParameter("disciplinaId", disciplinaId);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public List<DisciplinaProf> buscarTodos() {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<DisciplinaProf> query = em.createQuery("SELECT dp FROM DisciplinaProf dp", DisciplinaProf.class);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public void remover(int id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            DisciplinaProf dp = em.find(DisciplinaProf.class, id);
            if (dp != null) {
                em.remove(dp);
            }
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }
}
