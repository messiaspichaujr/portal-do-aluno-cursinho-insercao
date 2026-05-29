package pt.cursinhoinsercao.portalaluno.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recados")
public class Recado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "prof", nullable = false)
    private int prof;

    @Column(name = "texto", nullable = false)
    private String texto;

    @Column(name = "data", nullable = false)
    private LocalDateTime data;

    @Column(name = "img")
    private String img;

    public Recado() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getProf() { return prof; }
    public void setProf(int prof) { this.prof = prof; }
    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
    public LocalDateTime getData() { return data; }
    public void setData(LocalDateTime data) { this.data = data; }
    public String getImg() { return img; }
    public void setImg(String img) { this.img = img; }
}
