package pt.cursinhoinsercao.portalaluno.entity;

import javax.persistence.*;

@Entity
@Table(name = "disciplina_prof")
public class DisciplinaProf {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "prof", nullable = false)
    private int prof;

    @Column(name = "disciplina", nullable = false)
    private int disciplina;

    public DisciplinaProf() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getProf() { return prof; }
    public void setProf(int prof) { this.prof = prof; }
    public int getDisciplina() { return disciplina; }
    public void setDisciplina(int disciplina) { this.disciplina = disciplina; }
}
