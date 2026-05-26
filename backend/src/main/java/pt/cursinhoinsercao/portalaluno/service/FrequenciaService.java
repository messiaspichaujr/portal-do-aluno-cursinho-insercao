package pt.cursinhoinsercao.portalaluno.service;

import pt.cursinhoinsercao.portalaluno.dao.FrequenciaDAO;
import pt.cursinhoinsercao.portalaluno.entity.Frequencia;

import java.util.List;

public class FrequenciaService {

    private FrequenciaDAO frequenciaDAO = new FrequenciaDAO();

    public Frequencia lancar(Frequencia frequencia) throws Exception {
        if (frequencia.getAluno() <= 0) {
            throw new Exception("Aluno inválido.");
        }
        if (frequencia.getFrequencia() <= 0) {
            throw new Exception("Tipo de frequência inválido.");
        }
        if (frequencia.getData() == null) {
            throw new Exception("Data é obrigatória.");
        }
        frequenciaDAO.salvar(frequencia);
        return frequencia;
    }

    public List<Frequencia> buscarPorAluno(int alunoId) {
        return frequenciaDAO.buscarPorAluno(alunoId);
    }

    public List<Frequencia> buscarTodos() {
        return frequenciaDAO.buscarTodos();
    }

    public List<Frequencia> buscarPorDisciplina(int disciplinaId) {
        return frequenciaDAO.buscarPorDisciplina(disciplinaId);
    }

    public List<Frequencia> buscarPorAlunoEDisciplina(int alunoId, int disciplinaId) {
        return frequenciaDAO.buscarPorAlunoEDisciplina(alunoId, disciplinaId);
    }

    public void lancarLote(List<Frequencia> frequencias) throws Exception {
        for (Frequencia f : frequencias) {
            lancar(f);
        }
    }

    public void remover(int id) throws Exception {
        Frequencia existente = frequenciaDAO.buscarPorId(id);
        if (existente == null) {
            throw new Exception("Registro de frequência não encontrado.");
        }
        frequenciaDAO.remover(id);
    }
}
