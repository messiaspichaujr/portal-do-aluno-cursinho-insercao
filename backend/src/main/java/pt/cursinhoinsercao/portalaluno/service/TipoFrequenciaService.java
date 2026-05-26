package pt.cursinhoinsercao.portalaluno.service;

import pt.cursinhoinsercao.portalaluno.dao.TipoFrequenciaDAO;
import pt.cursinhoinsercao.portalaluno.entity.TipoFrequencia;

import java.util.List;

public class TipoFrequenciaService {

    private TipoFrequenciaDAO tipoFrequenciaDAO = new TipoFrequenciaDAO();

    public List<TipoFrequencia> buscarTodos() {
        return tipoFrequenciaDAO.buscarTodos();
    }

    public TipoFrequencia buscarPorId(int id) {
        return tipoFrequenciaDAO.buscarPorId(id);
    }
}
