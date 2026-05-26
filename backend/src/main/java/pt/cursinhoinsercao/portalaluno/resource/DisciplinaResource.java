package pt.cursinhoinsercao.portalaluno.resource;

import pt.cursinhoinsercao.portalaluno.entity.Disciplina;
import pt.cursinhoinsercao.portalaluno.seguranca.AdminOnly;
import pt.cursinhoinsercao.portalaluno.seguranca.Seguranca;
import pt.cursinhoinsercao.portalaluno.service.DisciplinaService;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/disciplinas")
public class DisciplinaResource {

    private DisciplinaService disciplinaService = new DisciplinaService();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    public Response buscarTodos() {
        List<Disciplina> disciplinas = disciplinaService.buscarTodos();
        return Response.ok(disciplinas).build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    public Response buscarPorId(@PathParam("id") int id) {
        Disciplina disciplina = disciplinaService.buscarPorId(id);
        if (disciplina == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Disciplina não encontrada.").build();
        }
        return Response.ok(disciplina).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    @AdminOnly
    public Response criar(Disciplina disciplina) {
        try {
            Disciplina criada = disciplinaService.criar(disciplina);
            return Response.status(Response.Status.CREATED).entity(criada).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Seguranca
    @AdminOnly
    public Response atualizar(@PathParam("id") int id, Disciplina disciplina) {
        try {
            disciplina.setId(id);
            disciplinaService.atualizar(disciplina);
            return Response.ok().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{id}")
    @Seguranca
    @AdminOnly
    public Response remover(@PathParam("id") int id) {
        try {
            disciplinaService.remover(id);
            return Response.noContent().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }
}
