package pt.cursinhoinsercao.portalaluno.entity;

import javax.persistence.*;

@Entity
@Table(name = "disciplina_aluno")
public class DisciplinaAluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "disciplina", nullable = false)
    private int disciplina;

    @Column(name = "aluno", nullable = false)
    private int aluno;

    public DisciplinaAluno() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getDisciplina() { return disciplina; }
    public void setDisciplina(int disciplina) { this.disciplina = disciplina; }
    public int getAluno() { return aluno; }
    public void setAluno(int aluno) { this.aluno = aluno; }
}
