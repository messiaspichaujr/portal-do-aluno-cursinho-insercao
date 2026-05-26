package pt.cursinhoinsercao.portalaluno.service;

import pt.cursinhoinsercao.portalaluno.dao.ConteudoDAO;
import pt.cursinhoinsercao.portalaluno.entity.Conteudo;

import java.util.List;

public class ConteudoService {

    private ConteudoDAO conteudoDAO = new ConteudoDAO();

    public Conteudo criar(Conteudo conteudo) throws Exception {
        if (conteudo.getLink() == null || conteudo.getLink().trim().isEmpty()) {
            throw new Exception("Link é obrigatório.");
        }
        conteudoDAO.salvar(conteudo);
        return conteudo;
    }

    public List<Conteudo> buscarTodos() {
        return conteudoDAO.buscarTodos();
    }

    public List<Conteudo> buscarPorDisciplina(int disciplinaId) {
        return conteudoDAO.buscarPorDisciplina(disciplinaId);
    }

    public void atualizar(Conteudo conteudo) throws Exception {
        Conteudo existente = conteudoDAO.buscarPorId(conteudo.getId());
        if (existente == null) {
            throw new Exception("Conteúdo não encontrado.");
        }
        if (conteudo.getLink() != null) {
            existente.setLink(conteudo.getLink());
        }
        if (conteudo.getDisciplina() != null) {
            existente.setDisciplina(conteudo.getDisciplina());
        }
        conteudoDAO.atualizar(existente);
    }

    public void remover(int id) throws Exception {
        Conteudo existente = conteudoDAO.buscarPorId(id);
        if (existente == null) {
            throw new Exception("Conteúdo não encontrado.");
        }
        conteudoDAO.remover(id);
    }
}
