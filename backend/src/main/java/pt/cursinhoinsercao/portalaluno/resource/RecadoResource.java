package pt.cursinhoinsercao.portalaluno.resource;

import pt.cursinhoinsercao.portalaluno.entity.Recado;
import pt.cursinhoinsercao.portalaluno.seguranca.AdminOnly;
import pt.cursinhoinsercao.portalaluno.seguranca.ProfessorOnly;
import pt.cursinhoinsercao.portalaluno.seguranca.Seguranca;
import pt.cursinhoinsercao.portalaluno.service.RecadoService;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/recados")
public class RecadoResource {

    private RecadoService recadoService = new RecadoService();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    public Response buscarTodos() {
        List<Recado> recados = recadoService.buscarTodos();
        return Response.ok(recados).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    @ProfessorOnly
    public Response criar(Recado recado) {
        try {
            Recado criado = recadoService.criar(recado);
            return Response.status(Response.Status.CREATED).entity(criado).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    @AdminOnly
    public Response atualizar(@PathParam("id") int id, Recado recado) {
        try {
            recado.setId(id);
            recadoService.atualizar(recado);
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
            recadoService.remover(id);
            return Response.noContent().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }
}
