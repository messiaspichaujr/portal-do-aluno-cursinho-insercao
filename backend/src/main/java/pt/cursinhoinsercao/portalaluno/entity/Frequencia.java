package pt.cursinhoinsercao.portalaluno.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "frequencia")
public class Frequencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "aluno", nullable = false)
    private int aluno;

    @Column(name = "data", nullable = false)
    private LocalDateTime data;

    @Column(name = "frequencia", nullable = false)
    private int frequencia;

    @Column(name = "justificativa", nullable = false)
    private String justificativa;

    @Column(name = "disciplina")
    private Integer disciplina;

    public Frequencia() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getAluno() { return aluno; }
    public void setAluno(int aluno) { this.aluno = aluno; }
    public LocalDateTime getData() { return data; }
    public void setData(LocalDateTime data) { this.data = data; }
    public int getFrequencia() { return frequencia; }
    public void setFrequencia(int frequencia) { this.frequencia = frequencia; }
    public String getJustificativa() { return justificativa; }
    public void setJustificativa(String justificativa) { this.justificativa = justificativa; }
    public Integer getDisciplina() { return disciplina; }
    public void setDisciplina(Integer disciplina) { this.disciplina = disciplina; }
}
