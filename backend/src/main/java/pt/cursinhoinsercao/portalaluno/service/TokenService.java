package pt.cursinhoinsercao.portalaluno.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import pt.cursinhoinsercao.portalaluno.entity.Usuario;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

public class TokenService {

    private static final Key CHAVE_SECRETA;
    private static final long TEMPO_EXPIRACAO = 3600000;

    static {
        String envSecret = System.getenv("JWT_SECRET");
        if (envSecret != null && !envSecret.isEmpty()) {
            byte[] decodedKey = Base64.getDecoder().decode(envSecret);
            CHAVE_SECRETA = Keys.hmacShaKeyFor(decodedKey);
        } else {
            CHAVE_SECRETA = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        }
    }

    public String gerarToken(Usuario usuario) {
        Date agora = new Date();
        Date dataExpiracao = new Date(agora.getTime() + TEMPO_EXPIRACAO);

        return Jwts.builder()
                .setIssuer("Portal Aluno API")
                .setSubject(Integer.toString(usuario.getId()))
                .claim("nome", usuario.getNome())
                .claim("tipo", usuario.getTipo())
                .setIssuedAt(agora)
                .setExpiration(dataExpiracao)
                .signWith(CHAVE_SECRETA)
                .compact();
    }

    public Claims validarToken(String token) throws Exception {
        return Jwts.parserBuilder()
                .setSigningKey(CHAVE_SECRETA)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
