package org.example.web.dto;

public record CarroCadastroForm(
                                    String modelo,
                                    String fabricante,
                                    Integer ano,
                                    Double preco,
                                    String cor,
                                    Integer quantidadePortas,
                                    String tipoCombustivel
                                    ) {



}
