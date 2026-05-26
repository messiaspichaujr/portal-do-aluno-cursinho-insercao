package pt.cursinhoinsercao.portalaluno;

import org.eclipse.jetty.server.Server;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pt.cursinhoinsercao.portalaluno.config.ServerConfigurator;

public class Main {

    private static final Logger logger = LoggerFactory.getLogger(Main.class);

    public static void main(String[] args) {
        Server server = ServerConfigurator.createServer();

        try {
            server.start();
            logger.info("Servidor iniciado em http://localhost:{}", server.getURI().getPort());
            server.join();
        } catch (Exception e) {
            logger.error("Erro ao iniciar o servidor", e);
        } finally {
            server.destroy();
        }
    }
}
