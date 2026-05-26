package pt.cursinhoinsercao.portalaluno.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pt.cursinhoinsercao.portalaluno.entity.Banner;
import pt.cursinhoinsercao.portalaluno.util.JPAUtil;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import java.util.List;

public class BannerDAO {

    private static final Logger logger = LoggerFactory.getLogger(BannerDAO.class);

    public Banner buscarAtivo(){
        EntityManager em = JPAUtil.getEntityManager();

        try{
            String jpql = "select b from Banner b where b.ativo = true";
            TypedQuery<Banner> query = em.createQuery(jpql, Banner.class);
            return query.getSingleResult();

        } catch (NoResultException e){
            return null;
        }finally {
            em.close();
        }
    }

    public List<Banner> listarHistorico(){
        EntityManager em = JPAUtil.getEntityManager();
        try{
            String jpql = "select b from Banner b order by b.dataCriacao desc";
            TypedQuery<Banner> query = em.createQuery(jpql, Banner.class);
            return query.getResultList();
        }finally {
            em.close();
        }
    }

    public void salvar(Banner banner){
        EntityManager em = JPAUtil.getEntityManager();

        try{
            em.getTransaction().begin();
            em.persist(banner);
            em.getTransaction().commit();
        } catch (Exception e){
            if(em.getTransaction().isActive()){
                em.getTransaction().rollback();
            }
            logger.error("Erro ao salvar banner", e);
        }finally {
            em.close();
        }
    }

    public void atualizar (Banner banner){
        EntityManager em = JPAUtil.getEntityManager();
        try{
            em.getTransaction().begin();
            em.merge(banner);
            em.getTransaction().commit();
        } catch (Exception e){
            if (em.getTransaction().isActive()){
                em.getTransaction().rollback();
            }
            logger.error("Erro ao atualizar banner", e);
        }finally {
            em.close();
        }
    }

    public void deletar(Banner banner){
        EntityManager em = JPAUtil.getEntityManager();
        try{
            em.getTransaction().begin();

            Banner bannerParaDeletar = em.contains(banner) ? banner : em.merge(banner);
            em.remove(bannerParaDeletar);
            em.getTransaction().commit();
        } catch (Exception e){
            if (em.getTransaction().isActive()){
                em.getTransaction().rollback();
            }
            logger.error("Erro ao deletar banner", e);
        }finally {
            em.close();
        }
    }

    public long contarBanners(){
        EntityManager em = JPAUtil.getEntityManager();
        try{
            String jpql = "select count(b) from Banner b";
            return em.createQuery(jpql, Long.class).getSingleResult();
        }finally {
            em.close();
        }
    }

    public void removerMaisAntigo(){
        EntityManager em = JPAUtil.getEntityManager();

        try{
            String jpql = "select b from Banner b order by b.dataCriacao asc";
            TypedQuery<Banner> query = em.createQuery(jpql, Banner.class).setMaxResults(1);
            Banner bannerMaisAntigo = query.getSingleResult();

            if (bannerMaisAntigo != null){
                em.getTransaction().begin();
                em.remove(bannerMaisAntigo);
                em.getTransaction().commit();
            }
        }catch (NoResultException e){

        }catch (Exception e){
            if (em.getTransaction().isActive()){
                em.getTransaction().rollback();
            }
            logger.error("Erro ao remover banner mais antigo", e);
        } finally {
            em.close();
        }
    }

    public void desativarTodos(EntityManager em) {
        String jpql = "UPDATE Banner b SET b.ativo = false WHERE b.ativo = true";
        Query query = em.createQuery(jpql);
        query.executeUpdate();
    }

    public Banner buscarPorId(int id) {
        EntityManager em = JPAUtil.getEntityManager();
        Banner banner = em.find(Banner.class, id);
        em.close();
        return banner;
    }
}
