package org.example.domain;



public class Veiculo {
    private Long id;
    private String modelo;
    private String fabricante;
    private int ano;
    private double preco;
    private String cor;
    private String tipoVeiculo;


    public Veiculo(){}
    public Veiculo(String modelo, String fabricante, int ano, Double preco, String cor, String tipoVeiculo) {
        this.modelo = modelo;
        this.fabricante = fabricante;
        this.ano = ano;
        this.preco = preco;
        this.cor = cor;
        this.tipoVeiculo = tipoVeiculo;
    }

    public String getCor(){
        return cor;
    }

    public void setCor(String cor){
        this.cor = cor;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getFabricante() {
        return fabricante;
    }

    public void setFabricante(String fabricante) {
        this.fabricante = fabricante;
    }

    public int getAno() {
        return ano;
    }

    public void setAno(int ano) {
        this.ano = ano;
    }

    public double getPreco() {
        return preco;
    }

    public void setPreco(double preco) {
        this.preco = preco;
    }

   /* public VeiculoResponse fromEntity(Veiculo veiculo){
        return new VeiculoResponse(modelo, fabricante, ano,
                preco);
    }*/
}
