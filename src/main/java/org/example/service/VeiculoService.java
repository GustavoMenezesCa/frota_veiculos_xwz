package org.example.service;

import org.example.dao.VeiculoDAO;
import org.example.domain.Veiculo;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;

@Service
public class VeiculoService {

    private final VeiculoDAO veiculoDAO;

    public VeiculoService(VeiculoDAO veiculoDAO){
        this.veiculoDAO = veiculoDAO;
    }


    public void excluirVeiculo(Long id) {

        try {
            veiculoDAO.excluirVeiculo(id);
        }
        catch (SQLException e) {
        throw new RuntimeException("Erro ao excluir carro no banco de dados.", e);
        }
    }

    public List<Veiculo> listarVeiculosCadastrados(){
        return veiculoDAO.listarTodos();
    }

    public List<Veiculo> consultarVeiculos(String tipo, String modelo, String cor, Integer ano) {
        return veiculoDAO.consultarVeiculoFiltrado(tipo, modelo, cor, ano);
    }

    public Veiculo findById(Long id){
        return veiculoDAO.buscarPorIdGenerico(id).orElseThrow();
    }

}


