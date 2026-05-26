package pt.cursinhoinsercao.portalaluno.service;

import pt.cursinhoinsercao.portalaluno.dao.AvaliacaoDAO;
import pt.cursinhoinsercao.portalaluno.entity.Avaliacao;

import java.util.List;

public class AvaliacaoService {

    private AvaliacaoDAO avaliacaoDAO = new AvaliacaoDAO();

    public Avaliacao criar(Avaliacao avaliacao) throws Exception {
        if (avaliacao.getNomeDaNota() == null || avaliacao.getNomeDaNota().trim().isEmpty()) {
            throw new Exception("Nome da avaliação é obrigatório.");
        }
        avaliacaoDAO.salvar(avaliacao);
        return avaliacao;
    }

    public Avaliacao buscarPorId(int id) {
        return avaliacaoDAO.buscarPorId(id);
    }

    public List<Avaliacao> buscarTodos() {
        return avaliacaoDAO.buscarTodos();
    }

    public List<Avaliacao> buscarPorDisciplina(int disciplinaId) {
        return avaliacaoDAO.buscarPorDisciplina(disciplinaId);
    }

    public void atualizar(Avaliacao avaliacao) throws Exception {
        Avaliacao existente = avaliacaoDAO.buscarPorId(avaliacao.getId());
        if (existente == null) {
            throw new Exception("Avaliação não encontrada.");
        }
        if (avaliacao.getNomeDaNota() != null) {
            existente.setNomeDaNota(avaliacao.getNomeDaNota());
        }
        avaliacaoDAO.atualizar(existente);
    }

    public void remover(int id) throws Exception {
        Avaliacao existente = avaliacaoDAO.buscarPorId(id);
        if (existente == null) {
            throw new Exception("Avaliação não encontrada.");
        }
        avaliacaoDAO.remover(id);
    }
}
