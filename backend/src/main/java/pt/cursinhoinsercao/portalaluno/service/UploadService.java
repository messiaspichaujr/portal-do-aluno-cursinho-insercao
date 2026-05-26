package pt.cursinhoinsercao.portalaluno.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

public class UploadService {

    private static final String UPLOAD_BASE_DIR = "./uploads";
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            ".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf", ".xls", ".xlsx", ".doc", ".docx"
    );

    private static final Set<String> ALLOWED_SUBFOLDERS = Set.of("imagens", "relatorios");

    public UploadService() {
        File uploadDir = new File(UPLOAD_BASE_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdir();
        }
    }

    public String salvarImagem(InputStream fileInputStream, String originalFileName) throws IOException {
        return salvarFicheiro(fileInputStream, originalFileName, "imagens");
    }

    public String salvarFicheiro(InputStream fileInputStream, String originalFileName, String subpasta) throws IOException {

        if (!ALLOWED_SUBFOLDERS.contains(subpasta)) {
            throw new IOException("Subpasta inválida: " + subpasta);
        }

        String extensao = "";
        int i = originalFileName.lastIndexOf('.');
        if (i > 0) {
            extensao = originalFileName.substring(i).toLowerCase();
        }

        if (!ALLOWED_EXTENSIONS.contains(extensao)) {
            throw new IOException("Tipo de ficheiro não permitido: " + extensao);
        }

        Path uploadPath = Paths.get(UPLOAD_BASE_DIR, subpasta).normalize();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String nomeFicheiroUnico = UUID.randomUUID().toString() + extensao;
        Path caminhoDestino = uploadPath.resolve(nomeFicheiroUnico).normalize();

        if (!caminhoDestino.startsWith(uploadPath)) {
            throw new IOException("Caminho de destino inválido.");
        }

        long bytesCopied = Files.copy(fileInputStream, caminhoDestino, StandardCopyOption.REPLACE_EXISTING);
        if (bytesCopied > MAX_FILE_SIZE) {
            Files.deleteIfExists(caminhoDestino);
            throw new IOException("Ficheiro excede o tamanho máximo permitido de 10MB.");
        }

        return "/" + UPLOAD_BASE_DIR.replace("./", "").replace("\\", "/") + "/" + subpasta + "/" + nomeFicheiroUnico;
    }
}
