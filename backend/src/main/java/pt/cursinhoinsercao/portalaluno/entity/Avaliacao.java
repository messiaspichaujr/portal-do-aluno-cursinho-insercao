package pt.cursinhoinsercao.portalaluno.entity;

import javax.persistence.*;

@Entity
@Table(name = "avaliacoes")
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "nomeDaNota", nullable = false)
    private String nomeDaNota;

    @Column(name = "disciplina")
    private Integer disciplina;

    public Avaliacao() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getNomeDaNota() { return nomeDaNota; }
    public void setNomeDaNota(String nomeDaNota) { this.nomeDaNota = nomeDaNota; }
    public Integer getDisciplina() { return disciplina; }
    public void setDisciplina(Integer disciplina) { this.disciplina = disciplina; }
}
