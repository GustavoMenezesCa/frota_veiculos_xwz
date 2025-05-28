package org.example.dao.impl;

import org.example.dao.VeiculoDAO;
import org.example.domain.Carro;
import org.example.domain.Moto;
import org.example.domain.TipoCombustivel;
import org.example.domain.Veiculo;
import org.springframework.context.annotation.Configuration;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Configuration
public class VeiculoDAOImpl implements VeiculoDAO {
    private static Connection conn = null;

    private static final String SELECT_VEICULOS_SQL =
            "SELECT v.id, v.modelo, v.fabricante, v.ano, v.cor, v.preco, v.tipo_veiculo, " +
                    "c.quantidade_portas, c.tipo_combustivel, m.cilindradas " +
                    "FROM VEICULO v " +
                    "LEFT JOIN CARRO c ON v.id = c.id_veiculo AND v.tipo_veiculo = 'CARRO' " +
                    "LEFT JOIN MOTO m ON v.id = m.id_veiculo AND v.tipo_veiculo = 'MOTO' ";


    private Connection getConnection() throws SQLException {

        String conexao = "jdbc:postgresql://localhost:5432/postgres";
        String usuario = "postgres";
        String senha = "12345";

        return DriverManager.getConnection(conexao, usuario, senha);
    }

    public void excluirVeiculo(Long id) throws SQLException {
        String sql = "DELETE FROM VEICULO WHERE id = ?;";
        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setLong(1, id);
            int affectedRows = pstmt.executeUpdate();

        } catch (SQLException e) {
            throw new SQLException("Erro ao excluir veículo com ID " + id + ": " + e.getMessage(), e);
        }
    }


    public List<Veiculo> listarTodos() {
        List<Veiculo> veiculos = new ArrayList<>();
        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement(); // Query simples sem parâmetros
             ResultSet rs = stmt.executeQuery( "SELECT v.id, v.modelo, v.fabricante, v.ano, v.cor, v.preco, v.tipo_veiculo, " +
                     "c.quantidade_portas, c.tipo_combustivel, m.cilindradas " +
                     "FROM VEICULO v " +
                     "LEFT JOIN CARRO c ON v.id = c.id_veiculo AND v.tipo_veiculo = 'CARRO' " +
                     "LEFT JOIN MOTO m ON v.id = m.id_veiculo AND v.tipo_veiculo = 'MOTO' " + "ORDER BY v.id")) {

            while (rs.next()) {
                veiculos.add(mapRowToVeiculo(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao listar todos os veículos: " + e.getMessage(), e);
        }
        return veiculos;
    }


    private Veiculo mapRowToVeiculo(ResultSet rs) throws SQLException {
        String tipoVeiculo = rs.getString("tipo_veiculo");
        if ("CARRO".equals(tipoVeiculo)) {
            Carro carro = new Carro();
            carro.setId(rs.getLong("id"));
            carro.setModelo(rs.getString("modelo"));
            carro.setFabricante(rs.getString("fabricante"));
            carro.setAno(rs.getInt("ano"));
            carro.setCor(rs.getString("cor"));
            carro.setPreco(rs.getDouble("preco"));
            carro.setQuantPortas(rs.getInt("quantidade_portas"));
            String tipoCombustivelStr = rs.getString("tipo_combustivel");
            if (tipoCombustivelStr != null) {
                carro.setTipCombustivel(TipoCombustivel.valueOf(tipoCombustivelStr));
            }
            return carro;
        } else if ("MOTO".equals(tipoVeiculo)) {
            Moto moto = new Moto();
            moto.setId(rs.getLong("id"));
            moto.setModelo(rs.getString("modelo"));
            moto.setFabricante(rs.getString("fabricante"));
            moto.setAno(rs.getInt("ano"));
            moto.setCor(rs.getString("cor"));
            moto.setPreco(rs.getDouble("preco"));
            moto.setCilindradas(rs.getInt("cilindradas"));
            return moto;
        } else {
            throw new SQLException("Tipo de veículo desconhecido: " + tipoVeiculo);
        }
    }

    public List<Veiculo> consultarVeiculoFiltrado(String tipo, String modelo, String cor, Integer ano) {
            List<Veiculo> veiculos = new ArrayList<>();
            StringBuilder sqlBuilder = new StringBuilder(SELECT_VEICULOS_SQL);
            List<Object> params = new ArrayList<>();
            boolean hasWhere = false;

            if (tipo != null && !tipo.trim().isEmpty()) {
                sqlBuilder.append(hasWhere ? " AND " : " WHERE ");
                sqlBuilder.append("v.tipo_veiculo = ?");
                params.add(tipo.toUpperCase());
                hasWhere = true;
            }
            if (modelo != null && !modelo.trim().isEmpty()) {
                sqlBuilder.append(hasWhere ? " AND " : " WHERE ");
                sqlBuilder.append("LOWER(v.modelo) LIKE LOWER(?)"); // Case-insensitive like
                params.add("%" + modelo + "%");
                hasWhere = true;
            }
            if (cor != null && !cor.trim().isEmpty()) {
                sqlBuilder.append(hasWhere ? " AND " : " WHERE ");
                sqlBuilder.append("LOWER(v.cor) = LOWER(?)");
                params.add(cor);
                hasWhere = true;
            }
            if (ano != null && ano > 0) {
                sqlBuilder.append(hasWhere ? " AND " : " WHERE ");
                sqlBuilder.append("v.ano = ?");
                params.add(ano);
                // hasWhere = true; // não precisa mais
            }
            sqlBuilder.append(" ORDER BY v.id");

            try (Connection conn = getConnection();
                 PreparedStatement pstmt = conn.prepareStatement(sqlBuilder.toString())) {

                for (int i = 0; i < params.size(); i++) {
                    pstmt.setObject(i + 1, params.get(i));
                }

                try (ResultSet rs = pstmt.executeQuery()) {
                    while (rs.next()) {
                        veiculos.add(mapRowToVeiculo(rs));
                    }
                }
            } catch (SQLException e) {
                throw new RuntimeException("Erro ao consultar veículos: " + e.getMessage(), e);
            }
            return veiculos;
        }

        public Optional<Veiculo> buscarPorIdGenerico(Long id) {
            String sql = SELECT_VEICULOS_SQL + " WHERE v.id = ?";
            try (Connection conn = getConnection();
                 PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setLong(1, id);
                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) {
                        return Optional.of(mapRowToVeiculo(rs));
                    }
                }
            } catch (SQLException e) {
                throw new RuntimeException("Erro ao buscar veículo genérico por ID: " + e.getMessage(), e);
            }
            return Optional.empty();
        }

    }


