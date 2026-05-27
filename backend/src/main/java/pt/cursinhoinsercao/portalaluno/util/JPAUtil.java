package pt.cursinhoinsercao.portalaluno.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import java.util.HashMap;
import java.util.Map;

public class JPAUtil {

    private static final Logger logger = LoggerFactory.getLogger(JPAUtil.class);

    private static final EntityManagerFactory FACTORY = createEntityManagerFactory();

    private static EntityManagerFactory createEntityManagerFactory() {
        Map<String, String> props = new HashMap<>();

        String dbUrl = System.getenv("DB_URL");
        String dbUser = System.getenv("DB_USER");
        String dbPassword = System.getenv("DB_PASSWORD");

        if (dbUrl != null) {
            props.put("javax.persistence.jdbc.url", dbUrl);

            if (dbUrl.startsWith("jdbc:postgresql")) {
                props.put("javax.persistence.jdbc.driver", "org.postgresql.Driver");
                props.put("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");

                // HikariCP config otimizado para NeonDB (serverless, dorme após 5 min)
                props.put("hibernate.connection.provider_class",
                        "org.hibernate.hikaricp.internal.HikariCPConnectionProvider");
                props.put("hibernate.hikari.maximumPoolSize", "3");
                props.put("hibernate.hikari.connectionTestQuery", "SELECT 1");
                props.put("hibernate.hikari.maxLifetime", "240000");       // 4 min (menos que os 5 min do NeonDB)
                props.put("hibernate.hikari.keepaliveTime", "120000");     // 2 min - valida conexões ociosas
                props.put("hibernate.hikari.connectionTimeout", "30000");  // 30s - espera o banco acordar
                props.put("hibernate.hikari.validationTimeout", "15000");  // 15s - tempo para testar conexão
                props.put("hibernate.hikari.leakDetectionThreshold", "60000");

                logger.info("HikariCP configurado para PostgreSQL (NeonDB)");
            } else if (dbUrl.startsWith("jdbc:mysql")) {
                props.put("javax.persistence.jdbc.driver", "com.mysql.cj.jdbc.Driver");
                props.put("hibernate.dialect", "org.hibernate.dialect.MySQL8Dialect");
            }
        }

        if (dbUser != null) props.put("javax.persistence.jdbc.user", dbUser);
        if (dbPassword != null) props.put("javax.persistence.jdbc.password", dbPassword);

        String showSql = System.getenv("HIBERNATE_SHOW_SQL");
        if (showSql != null) props.put("hibernate.show_sql", showSql);

        return Persistence.createEntityManagerFactory("portal-aluno-pu", props);
    }

    public static EntityManager getEntityManager() {
        return FACTORY.createEntityManager();
    }
}
