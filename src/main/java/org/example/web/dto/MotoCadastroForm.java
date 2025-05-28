package org.example.web.dto;

public record MotoCadastroForm(String modelo,
                               String fabricante,
                               Integer ano,
                               Double preco,
                               String cor,
                               Integer cilindradas
                               ) {
}
