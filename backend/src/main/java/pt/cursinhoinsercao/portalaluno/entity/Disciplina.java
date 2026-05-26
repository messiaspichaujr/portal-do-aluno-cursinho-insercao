package pt.cursinhoinsercao.portalaluno.entity;

import javax.persistence.*;

@Entity
@Table(name = "disciplina")
public class Disciplina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "sigla", nullable = false, length = 3)
    private String sigla;

    @Column(name = "nome", nullable = false)
    private String nome;

    public Disciplina() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getSigla() { return sigla; }
    public void setSigla(String sigla) { this.sigla = sigla; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
}
