package pt.cursinhoinsercao.portalaluno.entity;

import javax.persistence.*;

@Entity
@Table(name = "tipo_frequencia")
public class TipoFrequencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "tipo", nullable = false)
    private String tipo;

    public TipoFrequencia() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
}
