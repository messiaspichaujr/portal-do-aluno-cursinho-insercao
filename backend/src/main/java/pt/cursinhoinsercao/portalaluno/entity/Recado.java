package pt.cursinhoinsercao.portalaluno.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recados")
public class Recado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "assinatura", length = 100)
    private String assinatura;

    @Column(name = "texto", nullable = false)
    private String texto;

    @Column(name = "data", nullable = false)
    private LocalDateTime data;

    @Column(name = "img")
    private String img;

    public Recado() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getAssinatura() { return assinatura; }
    public void setAssinatura(String assinatura) { this.assinatura = assinatura; }
    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
    public LocalDateTime getData() { return data; }
    public void setData(LocalDateTime data) { this.data = data; }
    public String getImg() { return img; }
    public void setImg(String img) { this.img = img; }
}
