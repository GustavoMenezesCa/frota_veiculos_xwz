package org.example.domain;


import org.example.web.dto.MotoCadastroForm;

public class Moto extends Veiculo {
    private Integer cilindradas;

    public Moto(){}
    public Moto(int cilindradas) {
        this.cilindradas = cilindradas;
    }

    public Moto(String modelo, String fabricante, int ano, double preco, String cor, Integer cilindradas) {
        super(modelo, fabricante, ano, preco, cor, "MOTO");
        this.cilindradas = cilindradas;
    }

    public Integer getCilindradas() {
        return cilindradas;
    }

    public void setCilindradas(Integer cilindradas) {
        this.cilindradas = cilindradas;
    }

    public static Moto fromDto(MotoCadastroForm motoCadastroForm){
        return new Moto(motoCadastroForm.modelo(), motoCadastroForm.fabricante(),
                motoCadastroForm.ano(), motoCadastroForm.preco(), motoCadastroForm.cor(),
                motoCadastroForm.cilindradas());
    }
   
    public Moto atualizaDados(MotoCadastroForm motoCadastroForm) {
        if (motoCadastroForm.modelo() != null) setModelo(motoCadastroForm.modelo());
        if (motoCadastroForm.fabricante() != null) setFabricante(motoCadastroForm.fabricante());
        if (motoCadastroForm.ano() != null) setAno(motoCadastroForm.ano());
        if (motoCadastroForm.preco() != null) setPreco(motoCadastroForm.preco());
        if (motoCadastroForm.cor() != null) setCor(motoCadastroForm.cor());
        if (motoCadastroForm.cilindradas() != null) setCilindradas(motoCadastroForm.cilindradas());
        return this;
    }
}

