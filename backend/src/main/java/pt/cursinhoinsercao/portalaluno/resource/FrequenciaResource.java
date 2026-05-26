package pt.cursinhoinsercao.portalaluno.resource;

import pt.cursinhoinsercao.portalaluno.entity.Frequencia;
import pt.cursinhoinsercao.portalaluno.seguranca.ProfessorOnly;
import pt.cursinhoinsercao.portalaluno.seguranca.Seguranca;
import pt.cursinhoinsercao.portalaluno.service.FrequenciaService;
import pt.cursinhoinsercao.portalaluno.service.TipoFrequenciaService;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/frequencias")
public class FrequenciaResource {

    private FrequenciaService frequenciaService = new FrequenciaService();
    private TipoFrequenciaService tipoFrequenciaService = new TipoFrequenciaService();

    @GET
    @Path("/tipos")
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    public Response buscarTipos() {
        return Response.ok(tipoFrequenciaService.buscarTodos()).build();
    }

    @GET
    @Path("/aluno/{alunoId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    public Response buscarPorAluno(@PathParam("alunoId") int alunoId) {
        List<Frequencia> frequencias = frequenciaService.buscarPorAluno(alunoId);
        return Response.ok(frequencias).build();
    }

    @GET
    @Path("/disciplina/{disciplinaId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    public Response buscarPorDisciplina(@PathParam("disciplinaId") int disciplinaId) {
        List<Frequencia> frequencias = frequenciaService.buscarPorDisciplina(disciplinaId);
        return Response.ok(frequencias).build();
    }

    @GET
    @Path("/aluno/{alunoId}/disciplina/{disciplinaId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    public Response buscarPorAlunoEDisciplina(
            @PathParam("alunoId") int alunoId,
            @PathParam("disciplinaId") int disciplinaId) {
        List<Frequencia> frequencias = frequenciaService.buscarPorAlunoEDisciplina(alunoId, disciplinaId);
        return Response.ok(frequencias).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    @ProfessorOnly
    public Response buscarTodos() {
        List<Frequencia> frequencias = frequenciaService.buscarTodos();
        return Response.ok(frequencias).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    @ProfessorOnly
    public Response lancar(Frequencia frequencia) {
        try {
            Frequencia lancada = frequenciaService.lancar(frequencia);
            return Response.status(Response.Status.CREATED).entity(lancada).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @POST
    @Path("/lote")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    @ProfessorOnly
    public Response lancarLote(List<Frequencia> frequencias) {
        try {
            frequenciaService.lancarLote(frequencias);
            return Response.status(Response.Status.CREATED).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{id}")
    @Seguranca
    @ProfessorOnly
    public Response remover(@PathParam("id") int id) {
        try {
            frequenciaService.remover(id);
            return Response.noContent().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }
}
