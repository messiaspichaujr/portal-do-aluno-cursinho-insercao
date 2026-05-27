package pt.cursinhoinsercao.portalaluno.entity;

import javax.persistence.*;

@Entity
@Table(name = "conteudo")
public class Conteudo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "disciplina")
    private Integer disciplina;

    @Column(name = "link")
    private String link;

    @Column(name = "titulo")
    private String titulo;

    public Conteudo() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public Integer getDisciplina() { return disciplina; }
    public void setDisciplina(Integer disciplina) { this.disciplina = disciplina; }
    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
}
