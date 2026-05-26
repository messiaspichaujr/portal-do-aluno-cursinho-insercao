package pt.cursinhoinsercao.portalaluno.service;

import pt.cursinhoinsercao.portalaluno.dao.NotaDAO;
import pt.cursinhoinsercao.portalaluno.entity.Nota;

import java.util.List;

public class NotaService {

    private NotaDAO notaDAO = new NotaDAO();

    public Nota lancar(Nota nota) throws Exception {
        if (nota.getAluno() <= 0) {
            throw new Exception("Aluno inválido.");
        }
        if (nota.getAvaliacao() <= 0) {
            throw new Exception("Avaliação inválida.");
        }
        if (nota.getNota() < 0) {
            throw new Exception("Nota não pode ser negativa.");
        }

        Nota existente = notaDAO.buscarPorAlunoEAvaliacao(nota.getAluno(), nota.getAvaliacao());
        if (existente != null) {
            existente.setNota(nota.getNota());
            notaDAO.atualizar(existente);
            return existente;
        }

        notaDAO.salvar(nota);
        return nota;
    }

    public List<Nota> buscarPorAluno(int alunoId) {
        return notaDAO.buscarPorAluno(alunoId);
    }

    public List<Nota> buscarPorAvaliacao(int avaliacaoId) {
        return notaDAO.buscarPorAvaliacao(avaliacaoId);
    }

    public List<Nota> buscarTodos() {
        return notaDAO.buscarTodos();
    }

    public void remover(int id) throws Exception {
        Nota existente = notaDAO.buscarPorId(id);
        if (existente == null) {
            throw new Exception("Nota não encontrada.");
        }
        notaDAO.remover(id);
    }
}
