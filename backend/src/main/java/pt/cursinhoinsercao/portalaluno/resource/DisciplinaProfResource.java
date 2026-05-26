package pt.cursinhoinsercao.portalaluno.resource;

import pt.cursinhoinsercao.portalaluno.entity.DisciplinaProf;
import pt.cursinhoinsercao.portalaluno.seguranca.AdminOnly;
import pt.cursinhoinsercao.portalaluno.seguranca.Seguranca;
import pt.cursinhoinsercao.portalaluno.service.DisciplinaProfService;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/disciplinas-professores")
public class DisciplinaProfResource {

    private DisciplinaProfService disciplinaProfService = new DisciplinaProfService();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    public Response buscarTodos() {
        List<DisciplinaProf> associacoes = disciplinaProfService.buscarTodos();
        return Response.ok(associacoes).build();
    }

    @GET
    @Path("/professor/{profId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    public Response buscarPorProfessor(@PathParam("profId") int profId) {
        List<DisciplinaProf> associacoes = disciplinaProfService.buscarPorProfessor(profId);
        return Response.ok(associacoes).build();
    }

    @GET
    @Path("/disciplina/{disciplinaId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    public Response buscarPorDisciplina(@PathParam("disciplinaId") int disciplinaId) {
        List<DisciplinaProf> associacoes = disciplinaProfService.buscarPorDisciplina(disciplinaId);
        return Response.ok(associacoes).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    @AdminOnly
    public Response associar(DisciplinaProf dp) {
        try {
            DisciplinaProf criada = disciplinaProfService.associar(dp);
            return Response.status(Response.Status.CREATED).entity(criada).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{id}")
    @Seguranca
    @AdminOnly
    public Response desassociar(@PathParam("id") int id) {
        try {
            disciplinaProfService.desassociar(id);
            return Response.noContent().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }
}
