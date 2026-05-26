package pt.cursinhoinsercao.portalaluno.service;

import pt.cursinhoinsercao.portalaluno.dao.DisciplinaProfDAO;
import pt.cursinhoinsercao.portalaluno.entity.DisciplinaProf;

import java.util.List;

public class DisciplinaProfService {

    private DisciplinaProfDAO disciplinaProfDAO = new DisciplinaProfDAO();

    public DisciplinaProf associar(DisciplinaProf dp) throws Exception {
        if (dp.getProf() <= 0) {
            throw new Exception("Professor inválido.");
        }
        if (dp.getDisciplina() <= 0) {
            throw new Exception("Disciplina inválida.");
        }
        disciplinaProfDAO.salvar(dp);
        return dp;
    }

    public List<DisciplinaProf> buscarPorProfessor(int profId) {
        return disciplinaProfDAO.buscarPorProfessor(profId);
    }

    public List<DisciplinaProf> buscarPorDisciplina(int disciplinaId) {
        return disciplinaProfDAO.buscarPorDisciplina(disciplinaId);
    }

    public List<DisciplinaProf> buscarTodos() {
        return disciplinaProfDAO.buscarTodos();
    }

    public void desassociar(int id) throws Exception {
        disciplinaProfDAO.remover(id);
    }
}
