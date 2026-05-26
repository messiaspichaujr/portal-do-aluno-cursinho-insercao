package pt.cursinhoinsercao.portalaluno.resource;

import pt.cursinhoinsercao.portalaluno.entity.Nota;
import pt.cursinhoinsercao.portalaluno.seguranca.ProfessorOnly;
import pt.cursinhoinsercao.portalaluno.seguranca.Seguranca;
import pt.cursinhoinsercao.portalaluno.service.NotaService;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/notas")
public class NotaResource {

    private NotaService notaService = new NotaService();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    public Response buscarTodos() {
        List<Nota> notas = notaService.buscarTodos();
        return Response.ok(notas).build();
    }

    @GET
    @Path("/aluno/{alunoId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    public Response buscarPorAluno(@PathParam("alunoId") int alunoId) {
        List<Nota> notas = notaService.buscarPorAluno(alunoId);
        return Response.ok(notas).build();
    }

    @GET
    @Path("/avaliacao/{avaliacaoId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    @ProfessorOnly
    public Response buscarPorAvaliacao(@PathParam("avaliacaoId") int avaliacaoId) {
        List<Nota> notas = notaService.buscarPorAvaliacao(avaliacaoId);
        return Response.ok(notas).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    @ProfessorOnly
    public Response lancar(Nota nota) {
        try {
            Nota lancada = notaService.lancar(nota);
            return Response.status(Response.Status.CREATED).entity(lancada).build();
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
            notaService.remover(id);
            return Response.noContent().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }
}
