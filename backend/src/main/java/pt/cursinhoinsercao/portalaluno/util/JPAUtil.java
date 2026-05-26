package pt.cursinhoinsercao.portalaluno.util;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import java.util.HashMap;
import java.util.Map;

public class JPAUtil {

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
