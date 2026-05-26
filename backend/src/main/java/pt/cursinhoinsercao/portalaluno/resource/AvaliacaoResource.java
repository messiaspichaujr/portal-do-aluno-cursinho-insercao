package pt.cursinhoinsercao.portalaluno.resource;

import pt.cursinhoinsercao.portalaluno.entity.Avaliacao;
import pt.cursinhoinsercao.portalaluno.seguranca.ProfessorOnly;
import pt.cursinhoinsercao.portalaluno.seguranca.Seguranca;
import pt.cursinhoinsercao.portalaluno.service.AvaliacaoService;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/avaliacoes")
public class AvaliacaoResource {

    private AvaliacaoService avaliacaoService = new AvaliacaoService();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    public Response buscarTodos() {
        List<Avaliacao> avaliacoes = avaliacaoService.buscarTodos();
        return Response.ok(avaliacoes).build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    public Response buscarPorId(@PathParam("id") int id) {
        Avaliacao avaliacao = avaliacaoService.buscarPorId(id);
        if (avaliacao == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Avaliação não encontrada.").build();
        }
        return Response.ok(avaliacao).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    @ProfessorOnly
    public Response criar(Avaliacao avaliacao) {
        try {
            Avaliacao criada = avaliacaoService.criar(avaliacao);
            return Response.status(Response.Status.CREATED).entity(criada).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Seguranca
    @ProfessorOnly
    public Response atualizar(@PathParam("id") int id, Avaliacao avaliacao) {
        try {
            avaliacao.setId(id);
            avaliacaoService.atualizar(avaliacao);
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
            avaliacaoService.remover(id);
            return Response.noContent().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }
}
