package pt.cursinhoinsercao.portalaluno.resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;
import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Paths;
import java.util.Map;

@Path("/files")
public class FileResource {

    private static final Logger logger = LoggerFactory.getLogger(FileResource.class);
    private static final String UPLOAD_DIR = "./uploads";

    private static final Map<String, String> MIME_TYPES = Map.of(
        ".jpg", "image/jpeg",
        ".jpeg", "image/jpeg",
        ".png", "image/png",
        ".gif", "image/gif",
        ".webp", "image/webp",
        ".pdf", "application/pdf"
    );

    @GET
    @Path("{subpasta}/{nome: .*}")
    public Response getFile(
            @PathParam("subpasta") String subpasta,
            @PathParam("nome") String nome) {

        try {
            File file = Paths.get(UPLOAD_DIR, subpasta, nome).normalize().toFile();

            if (!file.exists() || !file.isFile()) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }

            String fileName = file.getName().toLowerCase();
            String mimeType = "application/octet-stream";
            for (Map.Entry<String, String> entry : MIME_TYPES.entrySet()) {
                if (fileName.endsWith(entry.getKey())) {
                    mimeType = entry.getValue();
                    break;
                }
            }

            StreamingOutput stream = output -> {
                try (FileInputStream fis = new FileInputStream(file)) {
                    byte[] buffer = new byte[8192];
                    int bytesRead;
                    while ((bytesRead = fis.read(buffer)) != -1) {
                        output.write(buffer, 0, bytesRead);
                    }
                }
            };

            return Response.ok(stream)
                    .type(mimeType)
                    .header("Cache-Control", "public, max-age=86400")
                    .build();

        } catch (Exception e) {
            logger.error("Erro ao servir ficheiro: {}/{}", subpasta, nome, e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
    }
}
