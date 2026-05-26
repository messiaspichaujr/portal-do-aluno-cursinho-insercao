package pt.cursinhoinsercao.portalaluno.filter;

import io.jsonwebtoken.Claims;
import pt.cursinhoinsercao.portalaluno.seguranca.AdminOnly;
import pt.cursinhoinsercao.portalaluno.seguranca.ProfessorOnly;
import pt.cursinhoinsercao.portalaluno.seguranca.Seguranca;
import pt.cursinhoinsercao.portalaluno.service.TokenService;

import javax.annotation.Priority;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;
import java.io.IOException;
import java.lang.reflect.Method;

@Provider
@Seguranca
@Priority(Priorities.AUTHENTICATION)
public class AuthenticationFilter implements ContainerRequestFilter {

    private TokenService tokenService = new TokenService();

    @Context
    private ResourceInfo resourceInfo;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {

        if (requestContext.getMethod().equalsIgnoreCase("OPTIONS")) {
            requestContext.abortWith(Response.ok().build());
            return;
        }

        String authorizationHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED)
                    .entity("Cabeçalho de autorização inválido.").build());
            return;
        }

        String token = authorizationHeader.substring("Bearer".length()).trim();

        try {
            Claims claims = tokenService.validarToken(token);
            Object tipoClaim = claims.get("tipo");
            int tipo = (tipoClaim instanceof Integer) ? (Integer) tipoClaim : Integer.parseInt(tipoClaim.toString());

            if (hasAnnotation(resourceInfo, AdminOnly.class) && tipo != 1) {
                requestContext.abortWith(Response.status(Response.Status.FORBIDDEN)
                        .entity("Acesso restrito a administradores.").build());
                return;
            }

            if (hasAnnotation(resourceInfo, ProfessorOnly.class) && tipo != 1 && tipo != 2) {
                requestContext.abortWith(Response.status(Response.Status.FORBIDDEN)
                        .entity("Acesso restrito a professores.").build());
                return;
            }

        } catch (Exception e) {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED)
                    .entity("Token inválido ou expirado.").build());
        }
    }

    private boolean hasAnnotation(ResourceInfo resourceInfo, Class<? extends java.lang.annotation.Annotation> annotation) {
        Method method = resourceInfo.getResourceMethod();
        if (method != null && method.isAnnotationPresent(annotation)) {
            return true;
        }
        Class<?> resourceClass = resourceInfo.getResourceClass();
        return resourceClass != null && resourceClass.isAnnotationPresent(annotation);
    }
}
