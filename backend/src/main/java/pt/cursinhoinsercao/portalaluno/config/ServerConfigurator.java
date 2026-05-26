package pt.cursinhoinsercao.portalaluno.config;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.servlet.FilterHolder;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.servlets.CrossOriginFilter;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.servlet.ServletContainer;

import javax.servlet.DispatcherType;
import java.util.EnumSet;

public class ServerConfigurator {

    public static Server createServer() {

        int port = Integer.parseInt(System.getenv().getOrDefault("SERVER_PORT", "8080"));
        Server server = new Server(port);

        ServletContextHandler apiContext = new ServletContextHandler(ServletContextHandler.NO_SESSIONS);
        apiContext.setContextPath("/");

        String allowedOrigins = System.getenv().getOrDefault("CORS_ALLOWED_ORIGINS", "http://localhost:5173");

        FilterHolder cors = apiContext.addFilter(CrossOriginFilter.class, "/*", EnumSet.of(DispatcherType.REQUEST));
        cors.setInitParameter(CrossOriginFilter.ALLOWED_ORIGINS_PARAM, allowedOrigins);
        cors.setInitParameter(CrossOriginFilter.ALLOWED_METHODS_PARAM, "GET,POST,PUT,DELETE,HEAD,OPTIONS");
        cors.setInitParameter(CrossOriginFilter.ALLOWED_HEADERS_PARAM, "Authorization,X-Requested-With,Content-Type,Accept,Origin");
        cors.setInitParameter(CrossOriginFilter.ALLOW_CREDENTIALS_PARAM, "true");
        cors.setInitParameter(CrossOriginFilter.CHAIN_PREFLIGHT_PARAM, "false");
        cors.setInitParameter(CrossOriginFilter.EXPOSED_HEADERS_PARAM, "Authorization,Content-Type");

        ResourceConfig config = new ResourceConfig();
        config.packages("pt.cursinhoinsercao.portalaluno");
        config.register(MultiPartFeature.class);
        ServletHolder servlet = new ServletHolder(new ServletContainer(config));
        apiContext.addServlet(servlet, "/api/*");

        ResourceHandler staticResourceHandler = new ResourceHandler();
        staticResourceHandler.setResourceBase("./uploads");
        staticResourceHandler.setDirectoriesListed(false);

        ServletContextHandler staticContext = new ServletContextHandler();
        staticContext.setContextPath("/uploads");
        staticContext.setHandler(staticResourceHandler);

        HandlerList handlers = new HandlerList();
        handlers.addHandler(staticContext);
        handlers.addHandler(apiContext);

        server.setHandler(handlers);
        return server;
    }
}
