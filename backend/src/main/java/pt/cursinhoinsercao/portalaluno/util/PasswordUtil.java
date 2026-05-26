package pt.cursinhoinsercao.portalaluno.util;

import org.mindrot.jbcrypt.BCrypt;

public class PasswordUtil {

    public static String hash(String senha) {
        return BCrypt.hashpw(senha, BCrypt.gensalt(12));
    }

    public static boolean verificar(String senha, String hash) {
        return BCrypt.checkpw(senha, hash);
    }
}
