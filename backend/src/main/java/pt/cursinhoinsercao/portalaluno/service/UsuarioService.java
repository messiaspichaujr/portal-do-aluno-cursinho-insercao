package pt.cursinhoinsercao.portalaluno.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pt.cursinhoinsercao.portalaluno.dao.UsuarioDAO;
import pt.cursinhoinsercao.portalaluno.dao.DisciplinaProfDAO;
import pt.cursinhoinsercao.portalaluno.dao.FrequenciaDAO;
import pt.cursinhoinsercao.portalaluno.dao.NotaDAO;
import pt.cursinhoinsercao.portalaluno.dao.RecadoDAO;
import pt.cursinhoinsercao.portalaluno.dto.Login;
import pt.cursinhoinsercao.portalaluno.dto.UsuarioDTO;
import pt.cursinhoinsercao.portalaluno.entity.Disciplina;
import pt.cursinhoinsercao.portalaluno.entity.DisciplinaAluno;
import pt.cursinhoinsercao.portalaluno.entity.Usuario;
import pt.cursinhoinsercao.portalaluno.util.PasswordUtil;

import java.util.List;

public class UsuarioService {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);

    private UsuarioDAO usuarioDAO = new UsuarioDAO();
    private TokenService tokenService = new TokenService();
    private DisciplinaService disciplinaService = new DisciplinaService();
    private DisciplinaAlunoService disciplinaAlunoService = new DisciplinaAlunoService();

    public Usuario cadastrar(Usuario novoUsuario) throws Exception {

        if (novoUsuario.getEmail() == null || novoUsuario.getEmail().trim().isEmpty()) {
            throw new Exception("Email é obrigatório.");
        }
        if (novoUsuario.getSenha() == null || novoUsuario.getSenha().length() < 6) {
            throw new Exception("A senha deve ter pelo menos 6 caracteres.");
        }
        if (novoUsuario.getNome() == null || novoUsuario.getNome().trim().isEmpty()) {
            throw new Exception("Nome é obrigatório.");
        }

        if (usuarioDAO.buscarPorEmail(novoUsuario.getEmail()) != null) {
            throw new Exception("Este email já está a ser utilizado");
        }

        int tipo = novoUsuario.getTipo();
        if (tipo != 1 && tipo != 2 && tipo != 3) {
            tipo = 3;
            novoUsuario.setTipo(tipo);
        }

        if (tipo == 1) {
            novoUsuario.setAtivo(true);
        } else {
            novoUsuario.setAtivo(false);
        }

        novoUsuario.setSenha(PasswordUtil.hash(novoUsuario.getSenha()));

        usuarioDAO.salvar(novoUsuario);
        return novoUsuario;
    }

    public String login(Login login) throws Exception {

        Usuario usuario = usuarioDAO.buscarPorEmail(login.getEmail());

        if (usuario == null || !PasswordUtil.verificar(login.getSenha(), usuario.getSenha())) {
            throw new Exception("Email ou senha inválidos.");
        }

        if (!usuario.isAtivo()) {
            throw new Exception("Usuário inativo. Aguarde a aprovação do seu cadastro.");
        }

        return tokenService.gerarToken(usuario);
    }

    public List<Usuario> listarCandidaturasPendentes() {
        return usuarioDAO.listarProfessoresPorStatus(false);
    }

    public Usuario buscarPorId(int id) {
        return usuarioDAO.buscarPorId(id);
    }

    public List<Usuario> listarEducadoresAtivos() {
        return usuarioDAO.listarProfessoresPorStatus(true);
    }

    public void aprovarCandidatura(int id) {
        Usuario usuario = usuarioDAO.buscarPorId(id);

        if (usuario != null && usuario.getTipo() == 2) {
            usuario.setAtivo(true);
            usuarioDAO.atualizar(usuario);
        }
    }

    public List<Usuario> listarMatriculasPendentes() {
        return usuarioDAO.listarAlunosPorStatus(false);
    }

    public List<Usuario> listarAlunosMatriculados() {
        return usuarioDAO.listarAlunosPorStatus(true);
    }

    public void aprovarMatricula(int id) {
        Usuario usuario = usuarioDAO.buscarPorId(id);
        if (usuario != null && usuario.getTipo() == 3) {
            usuario.setAtivo(true);
            usuarioDAO.atualizar(usuario);
            matricularEmTodasDisciplinas(usuario.getId());
        }
    }

    private void matricularEmTodasDisciplinas(int alunoId) {
        try {
            List<Disciplina> disciplinas = disciplinaService.buscarTodos();
            for (Disciplina d : disciplinas) {
                DisciplinaAluno da = new DisciplinaAluno();
                da.setAluno(alunoId);
                da.setDisciplina(d.getId());
                disciplinaAlunoService.matricular(da);
            }
        } catch (Exception e) {
            logger.error("Erro ao matricular aluno {} nas disciplinas: {}", alunoId, e.getMessage());
        }
    }

    public Usuario atualizar(int id, UsuarioDTO dto) throws Exception {
        Usuario usuario = usuarioDAO.buscarPorId(id);

        if (usuario == null) {
            throw new Exception("Usuário não encontrado com o ID: " + id);
        }

        if (dto.getNome() != null && !dto.getNome().trim().isEmpty()) {
            if (dto.getNome().trim().length() < 3) {
                throw new Exception("Nome deve ter pelo menos 3 caracteres.");
            }
            usuario.setNome(dto.getNome());
        }

        if (dto.getEmail() != null && !dto.getEmail().trim().isEmpty()) {
            if (!dto.getEmail().matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$")) {
                throw new Exception("Email inválido.");
            }
            if (!dto.getEmail().equals(usuario.getEmail())) {
                Usuario emailExistente = usuarioDAO.buscarPorEmail(dto.getEmail());
                if (emailExistente != null && emailExistente.getId() != id) {
                    throw new Exception("Este email já está a ser utilizado.");
                }
                usuario.setEmail(dto.getEmail());
            }
        }

        if (dto.getSenha() != null && !dto.getSenha().trim().isEmpty()) {
            if (dto.getSenha().length() < 6) {
                throw new Exception("A senha deve ter pelo menos 6 caracteres.");
            }
            usuario.setSenha(PasswordUtil.hash(dto.getSenha()));
        }

        if (dto.getAtivo() != null) {
            usuario.setAtivo(dto.getAtivo());
        }

        usuarioDAO.atualizar(usuario);
        return usuario;
    }

    public String verificarDependencias(int id) {
        Usuario usuario = usuarioDAO.buscarPorId(id);
        if (usuario == null) {
            return "Usuário não encontrado.";
        }

        StringBuilder dependencias = new StringBuilder();

        if (usuario.getTipo() == 2) {
            DisciplinaProfDAO profDao = new DisciplinaProfDAO();
            int disciplinas = profDao.contarPorProfessor(id);
            if (disciplinas > 0) {
                dependencias.append(disciplinas).append(" disciplina(s) associada(s); ");
            }

            RecadoDAO recadoDao = new RecadoDAO();
            int recados = recadoDao.contarPorProfessor(id);
            if (recados > 0) {
                dependencias.append(recados).append(" recado(s); ");
            }
        }

        if (usuario.getTipo() == 3) {
            NotaDAO notaDao = new NotaDAO();
            int notas = notaDao.contarPorAluno(id);
            if (notas > 0) {
                dependencias.append(notas).append(" nota(s) lançada(s); ");
            }

            FrequenciaDAO freqDao = new FrequenciaDAO();
            int frequencias = freqDao.contarPorAluno(id);
            if (frequencias > 0) {
                dependencias.append(frequencias).append(" frequência(s) registrada(s); ");
            }
        }

        return dependencias.length() > 0 ? dependencias.toString() : null;
    }

    public String excluirUsuario(int id, boolean excluirDependencias) throws Exception {
        Usuario usuario = usuarioDAO.buscarPorId(id);
        if (usuario == null) {
            throw new Exception("Usuário não encontrado.");
        }

        if (usuario.getTipo() == 2) {
            String dependencias = verificarDependencias(id);
            logger.info("Professor {} possui {} - será inativado (preservando histórico)", id, dependencias != null ? dependencias : "sem dependências");
            usuario.setAtivo(false);
            usuarioDAO.atualizar(usuario);
            return "Professor inativado com sucesso. Histórico preservado.";
        }

        if (usuario.getTipo() == 3) {
            String dependencias = verificarDependencias(id);
            if (dependencias != null && !excluirDependencias) {
                throw new Exception("Aluno possui dependências: " + dependencias + " Para excluir, confirme a exclusão das dependências.");
            }

            if (excluirDependencias) {
                logger.info("Excluindo aluno {} e suas dependências em cascata", id);
                NotaDAO notaDao = new NotaDAO();
                notaDao.removerPorAluno(id);

                FrequenciaDAO freqDao = new FrequenciaDAO();
                freqDao.removerPorAluno(id);
            }

            usuarioDAO.remover(usuario);
            logger.info("Aluno {} excluído com sucesso", id);
            return "Aluno excluído com sucesso.";
        }

        throw new Exception("Tipo de usuário não suportado para exclusão.");
    }
}
