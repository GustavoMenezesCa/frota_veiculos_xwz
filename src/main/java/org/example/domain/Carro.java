package org.example.domain;

import org.example.web.dto.CarroCadastroForm;


public class Carro extends Veiculo {
    private int quantPortas;
    private TipoCombustivel tipCombustivel;

    public Carro() {
    }

    public Carro(int quantPortas, TipoCombustivel tipCombustivel) {
        this.quantPortas = quantPortas;
        this.tipCombustivel = tipCombustivel;
    }

    public Carro(String modelo, String fabricante, int ano, double preco, String cor, int quantPortas, TipoCombustivel tipCombustivel) {
        super(modelo, fabricante, ano, preco,cor, "CARRO");
        this.quantPortas = quantPortas;
        this.tipCombustivel = tipCombustivel;
    }

    public Carro(String modelo, String fabricante, Double preco, String cor, int quantPortas, TipoCombustivel tipoCombustivel) {
    }

    public int getQuantPortas() {
        return quantPortas;
    }

    public void setQuantPortas(int quantPortas) {
        this.quantPortas = quantPortas;
    }

    public TipoCombustivel getTipCombustivel() {
        return tipCombustivel;
    }

    public void setTipCombustivel(TipoCombustivel tipCombustivel) {
        this.tipCombustivel = tipCombustivel;
    }


    public static Carro fromDto(CarroCadastroForm carroCadastroForm) {
        return new Carro(carroCadastroForm.modelo(), carroCadastroForm.fabricante(),
                carroCadastroForm.ano(), carroCadastroForm.preco(), carroCadastroForm.cor(),
                carroCadastroForm.quantidadePortas(), TipoCombustivel.fromString(carroCadastroForm.tipoCombustivel()));
    }

    public Carro atualizaDados(CarroCadastroForm carroCadastroForm) {
        if (carroCadastroForm.modelo() != null) setModelo(carroCadastroForm.modelo());
        if (carroCadastroForm.fabricante() != null) setFabricante(carroCadastroForm.fabricante());
        if (carroCadastroForm.ano() != null) setAno(carroCadastroForm.ano());
        if (carroCadastroForm.preco() != null) setPreco(carroCadastroForm.preco());
        if (carroCadastroForm.cor() != null) setCor(carroCadastroForm.cor());
        if (carroCadastroForm.quantidadePortas() != null) setQuantPortas(carroCadastroForm.quantidadePortas());
        if (carroCadastroForm.tipoCombustivel() != null)
            setTipCombustivel(TipoCombustivel.fromString(carroCadastroForm.tipoCombustivel()));
        return this;
    }
}
