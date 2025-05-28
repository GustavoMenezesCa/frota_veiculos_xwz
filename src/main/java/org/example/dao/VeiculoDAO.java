package org.example.dao;

import org.example.domain.Veiculo;

import java.sql.SQLException;
import java.util.List;

public interface VeiculoDAO {


    void excluirVeiculo(Long id) throws SQLException;
    List<Veiculo> listarTodos();
    List<Veiculo> consultarVeiculoFiltrado(String tipo, String modelo, String cor, Integer ano);


}