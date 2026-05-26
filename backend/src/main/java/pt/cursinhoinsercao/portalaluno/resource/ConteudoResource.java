package pt.cursinhoinsercao.portalaluno.resource;

import pt.cursinhoinsercao.portalaluno.entity.Conteudo;
import pt.cursinhoinsercao.portalaluno.seguranca.ProfessorOnly;
import pt.cursinhoinsercao.portalaluno.seguranca.Seguranca;
import pt.cursinhoinsercao.portalaluno.service.ConteudoService;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/conteudos")
public class ConteudoResource {

    private ConteudoService conteudoService = new ConteudoService();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    public Response buscarTodos() {
        List<Conteudo> conteudos = conteudoService.buscarTodos();
        return Response.ok(conteudos).build();
    }

    @GET
    @Path("/disciplina/{disciplinaId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    public Response buscarPorDisciplina(@PathParam("disciplinaId") int disciplinaId) {
        List<Conteudo> conteudos = conteudoService.buscarPorDisciplina(disciplinaId);
        return Response.ok(conteudos).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    @ProfessorOnly
    public Response criar(Conteudo conteudo) {
        try {
            Conteudo criado = conteudoService.criar(conteudo);
            return Response.status(Response.Status.CREATED).entity(criado).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Seguranca
    @ProfessorOnly
    public Response atualizar(@PathParam("id") int id, Conteudo conteudo) {
        try {
            conteudo.setId(id);
            conteudoService.atualizar(conteudo);
            return Response.ok().build();
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
            conteudoService.remover(id);
            return Response.noContent().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }
}
