package pt.cursinhoinsercao.portalaluno.resource;

import pt.cursinhoinsercao.portalaluno.entity.DisciplinaAluno;
import pt.cursinhoinsercao.portalaluno.seguranca.AdminOnly;
import pt.cursinhoinsercao.portalaluno.seguranca.Seguranca;
import pt.cursinhoinsercao.portalaluno.service.DisciplinaAlunoService;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/matriculas-disciplina")
public class DisciplinaAlunoResource {

    private DisciplinaAlunoService service = new DisciplinaAlunoService();

    @GET
    @Path("/disciplina/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    public Response buscarPorDisciplina(@PathParam("id") int disciplinaId) {
        List<DisciplinaAluno> matriculas = service.buscarPorDisciplina(disciplinaId);
        return Response.ok(matriculas).build();
    }

    @GET
    @Path("/aluno/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    public Response buscarPorAluno(@PathParam("id") int alunoId) {
        List<DisciplinaAluno> matriculas = service.buscarPorAluno(alunoId);
        return Response.ok(matriculas).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Seguranca
    @AdminOnly
    public Response matricular(DisciplinaAluno da) {
        try {
            DisciplinaAluno criado = service.matricular(da);
            return Response.status(Response.Status.CREATED).entity(criado).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{id}")
    @Seguranca
    @AdminOnly
    public Response desmatricular(@PathParam("id") int id) {
        try {
            service.desmatricular(id);
            return Response.noContent().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }
}
