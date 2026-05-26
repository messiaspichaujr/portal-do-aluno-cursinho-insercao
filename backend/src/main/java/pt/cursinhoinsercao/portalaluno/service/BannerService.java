package pt.cursinhoinsercao.portalaluno.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pt.cursinhoinsercao.portalaluno.dao.BannerDAO;
import pt.cursinhoinsercao.portalaluno.entity.Banner;
import pt.cursinhoinsercao.portalaluno.util.JPAUtil;

import javax.persistence.EntityManager;
import java.util.List;

public class BannerService {

    private static final Logger logger = LoggerFactory.getLogger(BannerService.class);

    private BannerDAO bannerDAO = new BannerDAO();
    private static final int MAX_BANNERS_HISTORICO = 5;

    public Banner buscarBannerAtivo() {
        return bannerDAO.buscarAtivo();
    }

    public List<Banner> listarHistorico() {
        return bannerDAO.listarHistorico();
    }

    public void criarNovoBanner(Banner novoBanner) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();

            bannerDAO.desativarTodos(em);

            novoBanner.setAtivo(true);
            em.persist(novoBanner);

            long total = (Long) em.createQuery("SELECT COUNT(b) FROM Banner b").getSingleResult();

            if (total > MAX_BANNERS_HISTORICO) {
                Banner maisAntigo = em.createQuery("SELECT b FROM Banner b ORDER BY b.dataCriacao ASC", Banner.class)
                        .setMaxResults(1)
                        .getSingleResult();
                em.remove(maisAntigo);
            }

            em.getTransaction().commit();

        } catch (Exception e) {

            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }

            logger.error("Erro ao criar novo banner", e);

            throw e;

        } finally {
            em.close();
        }
    }

    public void reativarBannerDoHistorico(int id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();

            bannerDAO.desativarTodos(em);

            Banner bannerParaReativar = em.find(Banner.class, id);
            if (bannerParaReativar != null) {

                bannerParaReativar.setAtivo(true);
                em.merge(bannerParaReativar);
            } else {

                throw new RuntimeException("Banner com ID " + id + " não encontrado.");
            }

            em.getTransaction().commit();

        } catch (Exception e) {

            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }

            logger.error("Erro ao reativar banner", e);

            throw e;

        } finally {
            em.close();
        }
    }
}
