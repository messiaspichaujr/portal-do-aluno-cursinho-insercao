package pt.cursinhoinsercao.portalaluno.dao;

import pt.cursinhoinsercao.portalaluno.entity.TipoFrequencia;
import pt.cursinhoinsercao.portalaluno.util.JPAUtil;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.List;

public class TipoFrequenciaDAO {

    public List<TipoFrequencia> buscarTodos() {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<TipoFrequencia> query = em.createQuery("SELECT t FROM TipoFrequencia t", TipoFrequencia.class);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public TipoFrequencia buscarPorId(int id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.find(TipoFrequencia.class, id);
        } finally {
            em.close();
        }
    }
}
