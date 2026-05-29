package pt.cursinhoinsercao.portalaluno.service;

import pt.cursinhoinsercao.portalaluno.dao.RecadoDAO;
import pt.cursinhoinsercao.portalaluno.entity.Recado;

import java.time.LocalDateTime;
import java.util.List;

public class RecadoService {

    private RecadoDAO recadoDAO = new RecadoDAO();

    public Recado criar(Recado recado) throws Exception {
        if (recado.getTexto() == null || recado.getTexto().trim().isEmpty()) {
            throw new Exception("Texto do recado é obrigatório.");
        }
        if (recado.getProf() <= 0) {
            throw new Exception("Professor inválido.");
        }
        if (recado.getData() == null) {
            recado.setData(LocalDateTime.now());
        }
        recadoDAO.salvar(recado);
        return recado;
    }

    public List<Recado> buscarTodos() {
        return recadoDAO.buscarTodos();
    }

    public List<Recado> buscarPorProfessor(int profId) {
        return recadoDAO.buscarPorProfessor(profId);
    }

    public void atualizar(Recado recado) throws Exception {
        Recado existente = recadoDAO.buscarPorId(recado.getId());
        if (existente == null) {
            throw new Exception("Recado não encontrado.");
        }
        if (recado.getTexto() != null) {
            existente.setTexto(recado.getTexto());
        }
        if (recado.getImg() != null) {
            existente.setImg(recado.getImg());
        }
        recadoDAO.atualizar(existente);
    }

    public void remover(int id) throws Exception {
        Recado existente = recadoDAO.buscarPorId(id);
        if (existente == null) {
            throw new Exception("Recado não encontrado.");
        }
        recadoDAO.remover(id);
    }
}
