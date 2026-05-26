package pt.cursinhoinsercao.portalaluno.entity;

import javax.persistence.*;

@Entity
@Table(name = "notas")
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "aluno", nullable = false)
    private int aluno;

    @Column(name = "avaliacao", nullable = false)
    private int avaliacao;

    @Column(name = "nota", nullable = false)
    private double nota;

    @Column(name = "disciplina")
    private Integer disciplina;

    public Nota() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getAluno() { return aluno; }
    public void setAluno(int aluno) { this.aluno = aluno; }
    public int getAvaliacao() { return avaliacao; }
    public void setAvaliacao(int avaliacao) { this.avaliacao = avaliacao; }
    public double getNota() { return nota; }
    public void setNota(double nota) { this.nota = nota; }
    public Integer getDisciplina() { return disciplina; }
    public void setDisciplina(Integer disciplina) { this.disciplina = disciplina; }
}
