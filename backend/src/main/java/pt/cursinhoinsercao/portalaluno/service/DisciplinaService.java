package pt.cursinhoinsercao.portalaluno.service;

import pt.cursinhoinsercao.portalaluno.dao.DisciplinaDAO;
import pt.cursinhoinsercao.portalaluno.entity.Disciplina;

import java.util.List;

public class DisciplinaService {

    private DisciplinaDAO disciplinaDAO = new DisciplinaDAO();

    public Disciplina criar(Disciplina disciplina) throws Exception {
        if (disciplina.getNome() == null || disciplina.getNome().trim().isEmpty()) {
            throw new Exception("Nome da disciplina é obrigatório.");
        }
        if (disciplina.getSigla() == null || disciplina.getSigla().trim().isEmpty()) {
            throw new Exception("Sigla da disciplina é obrigatória.");
        }
        disciplinaDAO.salvar(disciplina);
        return disciplina;
    }

    public Disciplina buscarPorId(int id) {
        return disciplinaDAO.buscarPorId(id);
    }

    public List<Disciplina> buscarTodos() {
        return disciplinaDAO.buscarTodos();
    }

    public void atualizar(Disciplina disciplina) throws Exception {
        Disciplina existente = disciplinaDAO.buscarPorId(disciplina.getId());
        if (existente == null) {
            throw new Exception("Disciplina não encontrada.");
        }
        if (disciplina.getNome() != null) {
            existente.setNome(disciplina.getNome());
        }
        if (disciplina.getSigla() != null) {
            existente.setSigla(disciplina.getSigla());
        }
        disciplinaDAO.atualizar(existente);
    }

    public void remover(int id) throws Exception {
        Disciplina existente = disciplinaDAO.buscarPorId(id);
        if (existente == null) {
            throw new Exception("Disciplina não encontrada.");
        }
        disciplinaDAO.remover(id);
    }
}
