package pt.cursinhoinsercao.portalaluno.config;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ContextHandler;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.servlet.FilterHolder;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.servlets.CrossOriginFilter;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.servlet.ServletContainer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.DispatcherType;
import java.util.EnumSet;

public class ServerConfigurator {

    private static final Logger logger = LoggerFactory.getLogger(ServerConfigurator.class);

    public static Server createServer() {

        int port = Integer.parseInt(System.getenv().getOrDefault("SERVER_PORT", "8080"));
        logger.info("=== INICIANDO SERVIDOR NA PORTA {} ===", port);

        Server server = new Server(port);

        ServletContextHandler apiContext = new ServletContextHandler(ServletContextHandler.NO_SESSIONS);
        apiContext.setContextPath("/");

        String allowedOrigins = System.getenv().getOrDefault("CORS_ALLOWED_ORIGINS", "http://localhost:5173");
        logger.info("=== CORS ALLOWED ORIGINS: {} ===", allowedOrigins);

        // CORS filter aplicado a TODAS as rotas
        FilterHolder cors = apiContext.addFilter(CrossOriginFilter.class, "/*", EnumSet.allOf(DispatcherType.class));
        cors.setInitParameter(CrossOriginFilter.ALLOWED_ORIGINS_PARAM, allowedOrigins);
        cors.setInitParameter(CrossOriginFilter.ALLOWED_METHODS_PARAM, "GET,POST,PUT,DELETE,HEAD,OPTIONS");
        cors.setInitParameter(CrossOriginFilter.ALLOWED_HEADERS_PARAM, "Authorization,X-Requested-With,Content-Type,Accept,Origin");
        cors.setInitParameter(CrossOriginFilter.ALLOW_CREDENTIALS_PARAM, "true");
        cors.setInitParameter(CrossOriginFilter.CHAIN_PREFLIGHT_PARAM, "false");
        cors.setInitParameter(CrossOriginFilter.EXPOSED_HEADERS_PARAM, "Authorization,Content-Type");
        cors.setInitParameter("preflightMaxAge", "1728000");

        logger.info("=== CORS FILTER CONFIGURADO ===");

        ResourceConfig config = new ResourceConfig();
        config.packages("pt.cursinhoinsercao.portalaluno");
        config.register(MultiPartFeature.class);
        ServletHolder servlet = new ServletHolder(new ServletContainer(config));
        apiContext.addServlet(servlet, "/api/*");

        ResourceHandler staticResourceHandler = new ResourceHandler();
        staticResourceHandler.setResourceBase("./uploads");
        staticResourceHandler.setDirectoriesListed(false);
        staticResourceHandler.setWelcomeFiles(new String[]{});

        ContextHandler uploadContext = new ContextHandler("/uploads");
        uploadContext.setHandler(staticResourceHandler);

        HandlerList handlers = new HandlerList();
        handlers.addHandler(uploadContext);
        handlers.addHandler(apiContext);

        server.setHandler(handlers);

        logger.info("=== SERVIDOR CONFIGURADO COM SUCESSO ===");
        return server;
    }
}
