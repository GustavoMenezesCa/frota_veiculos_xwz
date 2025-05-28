package org.example.dao.impl;


import org.example.dao.CarroDAO;
import org.example.domain.Carro;
import org.example.domain.TipoCombustivel;
import org.example.domain.Veiculo;
import org.springframework.context.annotation.Configuration;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.postgresql.util.JdbcBlackHole.close;

@Configuration
public class CarroDAOImpl implements CarroDAO {

    private static Connection conn = null;

    private Connection getConnection() throws SQLException {

        String conexao = "jdbc:postgresql://localhost:5432/postgres";
        String usuario = "postgres";
        String senha = "12345";

        return DriverManager.getConnection(conexao, usuario, senha);
    }





    public Carro cadastrarCarro(Carro carro) throws SQLException{

        String sqlVeiculo = "INSERT INTO VEICULO(modelo, fabricante, ano, preco, tipo_veiculo) VALUES (?,?,?,?, 'CARRO');";
        String sqlCarro = "INSERT INTO CARRO (id_veiculo, quantidade_portas, tipo_combustivel) VALUES (?,?,?);";

        Connection conn = null;
        PreparedStatement pstmtVeiculo = null;
        PreparedStatement pstmtCarro = null;
        ResultSet generatedKeys = null;

        try {
            conn = getConnection();
            conn.setAutoCommit(false);
            pstmtVeiculo = conn.prepareStatement(sqlVeiculo, Statement.RETURN_GENERATED_KEYS);
            pstmtVeiculo.setString(1, carro.getModelo());
            pstmtVeiculo.setString(2, carro.getFabricante());
            pstmtVeiculo.setInt(3, carro.getAno());
            pstmtVeiculo.setDouble(4, carro.getPreco());

            int affectedRowsVeiculo = pstmtVeiculo.executeUpdate();

            /*if (affectedRowsVeiculo == 0) {
                throw new SQLException("Falha ao inserir em VEICULO, nenhuma linha afetada.");
            }*/

            generatedKeys = pstmtVeiculo.getGeneratedKeys();
            if (generatedKeys.next()) {
                carro.setId(generatedKeys.getLong(1)); // Define o ID no objeto carro
            } else {
                conn.rollback(); // Desfaz a inserção em VEICULO se não conseguiu ID
                throw new SQLException("Falha ao obter o ID do veículo gerado.");
            }
            pstmtCarro = conn.prepareStatement(sqlCarro);
            pstmtCarro.setLong(1, carro.getId()); // Usa o ID obtido acima
            pstmtCarro.setInt(2, carro.getQuantPortas());
            pstmtCarro.setString(3, carro.getTipCombustivel().toString());

            int affectedRowsCarro = pstmtCarro.executeUpdate();

            if (affectedRowsCarro == 0) {
                conn.rollback(); // Desfaz tudo se falhar ao inserir em CARRO
                throw new SQLException("Falha ao inserir em CARRO, nenhuma linha afetada.");
            }

            conn.commit();
            return carro;
        }
        catch (SQLException e){
            if (conn != null) {
                try {
                    System.err.println("Transação está sendo revertida para o cadastro do carro.");
                    conn.rollback();
                } catch (SQLException excep) {
                    System.err.println("Erro ao tentar reverter a transação: " + excep.getMessage());
                }
            }
            throw new SQLException("Erro ao cadastrar carro: " + e.getMessage(), e);
        } finally {
            if (generatedKeys != null) try { generatedKeys.close(); } catch (SQLException e) { /* log ou ignore */ }
            if (pstmtVeiculo != null) try { pstmtVeiculo.close(); } catch (SQLException e) { /* log ou ignore */ }
            if (pstmtCarro != null) try { pstmtCarro.close(); } catch (SQLException e) { /* log ou ignore */ }
            if (conn != null) {
                try {
                    conn.setAutoCommit(true); // Restaura o modo de autocommit padrão
                    conn.close();
                } catch (SQLException e) { /* log ou ignore */ }
            }
        }
    }



    public List<Carro> consultarCarros(String modeloFiltro, String corFiltro, Integer anoFiltro) throws SQLException {
        StringBuilder sqlBuilder = new StringBuilder(
                "SELECT v.id, v.modelo, v.fabricante, v.ano, v.preco, v.cor, " + // Adicionei v.cor
                        "c.quantidade_portas, c.tipo_combustivel " +
                        "FROM VEICULO v " +
                        "INNER JOIN CARRO c ON v.id = c.id_veiculo " // INNER JOIN porque queremos APENAS carros
        );

        List<Object> params = new ArrayList<>();
        List<String> conditions = new ArrayList<>();

        // Adiciona condição fixa para tipo_veiculo se você ainda tiver essa coluna e quiser usá-la
        // conditions.add("v.tipo_veiculo = 'CARRO'"); // Já implícito pelo INNER JOIN com CARRO

        if (modeloFiltro != null && !modeloFiltro.isEmpty()) {
            conditions.add("v.modelo ILIKE ?");
            params.add("%" + modeloFiltro + "%");
        }
        if (corFiltro != null && !corFiltro.isEmpty()) {
            conditions.add("v.cor ILIKE ?");
            params.add("%" + corFiltro + "%");
        }
        if (anoFiltro != null && anoFiltro > 0) {
            conditions.add("v.ano = ?");
            params.add(anoFiltro);
        }

        if (!conditions.isEmpty()) {
            sqlBuilder.append(" WHERE ");
            sqlBuilder.append(String.join(" AND ", conditions));
        }
        sqlBuilder.append(" ORDER BY v.id;");

        List<Carro> carros = new ArrayList<>();
        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sqlBuilder.toString())) {

            for (int i = 0; i < params.size(); i++) {
                pstmt.setObject(i + 1, params.get(i));
            }

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Carro carro = new Carro();
                    carro.setId(rs.getLong("id"));
                    carro.setModelo(rs.getString("modelo"));
                    carro.setFabricante(rs.getString("fabricante"));
                    carro.setAno(rs.getInt("ano"));
                    carro.setPreco(rs.getDouble("preco"));
                    // carro.setTipoVeiculo("CARRO"); // Se o objeto Carro tiver esse campo
                    carro.setCor(rs.getString("cor")); // Se o objeto Carro tiver esse campo

                    carro.setQuantPortas(rs.getInt("quantidade_portas"));
                    if (carro.getTipCombustivel() != null) {
                        pstmt.setString(3, carro.getTipCombustivel().name()); // Usa .name() do Enum
                    } else {
                        pstmt.setNull(3, Types.VARCHAR); // Ou lance erro se for obrigatório
                    }; // Ajuste para Enum se necessário
                    carros.add(carro);
                }
            }
        } catch (SQLException e) {
            throw new SQLException("Erro ao consultar carros: " + e.getMessage(), e);
        }
        return carros;
    }


    public Carro atualizarCarro(Carro carro) {
        if (carro.getId() == null) {
            throw new IllegalArgumentException("ID do carro não pode ser nulo para atualização.");
        }
        Connection conn = null;
        PreparedStatement pstmtVeiculo = null;
        PreparedStatement pstmtCarro = null;

        try {
            conn = getConnection();
            conn.setAutoCommit(false);

            // Atualizar VEICULO
            pstmtVeiculo = conn.prepareStatement("UPDATE VEICULO SET modelo = ?, fabricante = ?, ano = ?, cor = ?, preco = ? WHERE id = ?;");
            pstmtVeiculo.setString(1, carro.getModelo());
            pstmtVeiculo.setString(2, carro.getFabricante());
            pstmtVeiculo.setInt(3, carro.getAno());
            pstmtVeiculo.setString(4, carro.getCor());
            pstmtVeiculo.setDouble(5, carro.getPreco());
            pstmtVeiculo.setLong(6, carro.getId());
            int veiculoRowsAffected = pstmtVeiculo.executeUpdate();

            if (veiculoRowsAffected == 0) {
                throw new SQLException("Nenhum veículo encontrado com o ID: " + carro.getId() + " para atualizar.");
            }

            // Atualizar CARRO
            pstmtCarro = conn.prepareStatement("UPDATE CARRO SET quantidade_portas = ?, tipo_combustivel = ? WHERE id_veiculo = ?;");
            pstmtCarro.setInt(1, carro.getQuantPortas());
            pstmtCarro.setString(2, carro.getTipCombustivel().name());
            pstmtCarro.setLong(3, carro.getId());
            pstmtCarro.executeUpdate();

            conn.commit();
            return carro;

        } catch (SQLException e) {
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    System.err.println("Erro ao fazer rollback: " + ex.getMessage());
                }
            }
            throw new RuntimeException("Erro ao atualizar carro: " + e.getMessage(), e);
        } finally {
            close(pstmtCarro);
            close(pstmtVeiculo);
            close(conn);
        }
    }

    public Optional<Carro> buscarPorId(Long id) {
        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement("SELECT v.id, v.modelo, v.fabricante, v.ano, v.cor, v.preco, c.quantidade_portas, c.tipo_combustivel " +
                     "FROM VEICULO v JOIN CARRO c ON v.id = c.id_veiculo WHERE v.id = ? AND v.tipo_veiculo = 'CARRO';")) {

            pstmt.setLong(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapRowToCarro(rs));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar carro por ID: " + e.getMessage(), e);
        }
        return Optional.empty();
    }

    private Carro mapRowToCarro(ResultSet rs) throws SQLException {
        Carro carro = new Carro();
        carro.setId(rs.getLong("id"));
        carro.setModelo(rs.getString("modelo"));
        carro.setFabricante(rs.getString("fabricante"));
        carro.setAno(rs.getInt("ano"));
        carro.setCor(rs.getString("cor"));
        carro.setPreco(rs.getDouble("preco"));
        carro.setQuantPortas(rs.getInt("quantidade_portas"));
        carro.setTipCombustivel(TipoCombustivel.valueOf(rs.getString("tipo_combustivel")));
        return carro;
    }


}
