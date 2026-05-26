package pt.cursinhoinsercao.portalaluno.service;

import pt.cursinhoinsercao.portalaluno.dao.DisciplinaAlunoDAO;
import pt.cursinhoinsercao.portalaluno.entity.DisciplinaAluno;

import java.util.List;

public class DisciplinaAlunoService {

    private final DisciplinaAlunoDAO dao;

    public DisciplinaAlunoService() {
        this.dao = new DisciplinaAlunoDAO();
    }

    public DisciplinaAlunoService(DisciplinaAlunoDAO dao) {
        this.dao = dao;
    }

    public DisciplinaAluno matricular(DisciplinaAluno da) throws Exception {
        DisciplinaAluno existente = dao.buscarPorAlunoEDisciplina(da.getAluno(), da.getDisciplina());
        if (existente != null) {
            return existente;
        }
        dao.salvar(da);
        return da;
    }

    public List<DisciplinaAluno> buscarPorDisciplina(int disciplinaId) {
        return dao.buscarPorDisciplina(disciplinaId);
    }

    public List<DisciplinaAluno> buscarPorAluno(int alunoId) {
        return dao.buscarPorAluno(alunoId);
    }

    public void desmatricular(int id) throws Exception {
        dao.remover(id);
    }
}
