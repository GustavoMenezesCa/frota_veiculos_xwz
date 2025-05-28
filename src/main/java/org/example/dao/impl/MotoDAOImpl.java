package org.example.dao.impl;

import org.example.dao.MotoDAO;
import org.example.domain.Moto;
import org.springframework.context.annotation.Configuration;

import java.sql.*;
import java.util.Optional;

@Configuration
public class MotoDAOImpl implements MotoDAO {

    private static Connection conn = null;

    private Connection getConnection() throws SQLException {

        String conexao = "jdbc:postgresql://localhost:5432/postgres";
        String usuario = "postgres";
        String senha = "12345";

        return DriverManager.getConnection(conexao, usuario, senha);
    }


    public Moto cadastrarMoto(Moto moto) throws SQLException {
        String sqlVeiculo = "INSERT INTO VEICULO(modelo, fabricante, ano, preco, tipo_veiculo) VALUES (?,?,?,?, 'MOTO');";
        String sqlMoto = "INSERT INTO MOTO (id_veiculo, cilindradas) VALUES (?,?);";

        try (Connection conn = getConnection()) {
            conn.setAutoCommit(false);

            try (
                    PreparedStatement pstmtVeiculo = conn.prepareStatement(sqlVeiculo, Statement.RETURN_GENERATED_KEYS);
            ) {
                pstmtVeiculo.setString(1, moto.getModelo());
                pstmtVeiculo.setString(2, moto.getFabricante());
                pstmtVeiculo.setInt(3, moto.getAno());
                pstmtVeiculo.setDouble(4, moto.getPreco());
                pstmtVeiculo.executeUpdate();

                try (ResultSet generatedKeys = pstmtVeiculo.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        moto.setId(generatedKeys.getLong(1));
                    } else {
                        conn.rollback();
                        throw new SQLException("Falha ao obter o ID do veículo gerado.");
                    }
                }
            }

            try (PreparedStatement pstmtMoto = conn.prepareStatement(sqlMoto)) {
                pstmtMoto.setLong(1, moto.getId());
                pstmtMoto.setInt(2, moto.getCilindradas());

                int affectedRowsCarro = pstmtMoto.executeUpdate();
                if (affectedRowsCarro == 0) {
                    conn.rollback();
                    throw new SQLException("Falha ao inserir na tabela Moto, nenhuma linha inserida");
                }
            }

            conn.commit();
            return moto;

        } catch (SQLException e) {
            throw new SQLException("Erro ao cadastrar moto: " + e.getMessage(), e);
        }
    }



    public Moto atualizar(Moto moto) {
        if (moto.getId() == null) {
            throw new IllegalArgumentException("ID da moto não pode ser nulo para atualização.");
        }
        Connection conn = null;
        PreparedStatement pstmtVeiculo = null;
        PreparedStatement pstmtMoto = null;

        try {
            conn = getConnection();
            conn.setAutoCommit(false);

            pstmtVeiculo = conn.prepareStatement("UPDATE VEICULO SET modelo = ?, fabricante = ?, ano = ?, cor = ?, preco = ? WHERE id = ?;");
            pstmtVeiculo.setString(1, moto.getModelo());
            pstmtVeiculo.setString(2, moto.getFabricante());
            pstmtVeiculo.setInt(3, moto.getAno());
            pstmtVeiculo.setString(4, moto.getCor());
            pstmtVeiculo.setDouble(5, moto.getPreco());
            pstmtVeiculo.setLong(6, moto.getId());
            int veiculoRowsAffected = pstmtVeiculo.executeUpdate();

            if (veiculoRowsAffected == 0) {
                throw new SQLException("Nenhuma moto encontrada com o ID: " + moto.getId() + " para atualizar.");
            }

            pstmtMoto = conn.prepareStatement("UPDATE MOTO SET cilindrada = ? WHERE id_veiculo = ?;");
            pstmtMoto.setInt(1, moto.getCilindradas());
            pstmtMoto.setLong(2, moto.getId());
            pstmtMoto.executeUpdate();

            conn.commit();
            return moto;

        } catch (SQLException e) {
            if (conn != null) try { conn.rollback(); } catch (SQLException ex) { System.err.println("Erro rollback: " + ex.getMessage());}
            throw new RuntimeException("Erro ao atualizar moto: " + e.getMessage(), e);
        } finally {
            close(pstmtMoto);
            close(pstmtVeiculo);
            close(conn);
        }
    }


    public Optional<Moto> buscarPorId(Long id) {
        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement("SELECT v.id, v.modelo, v.fabricante, v.ano, v.cor, v.preco, m.cilindrada " +
                     "FROM VEICULO v JOIN MOTO m ON v.id = m.id_veiculo WHERE v.id = ? AND v.tipo_veiculo = 'MOTO';")) {

            pstmt.setLong(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapRowToMoto(rs));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar moto por ID: " + e.getMessage(), e);
        }
        return Optional.empty();
    }

    private Moto mapRowToMoto(ResultSet rs) throws SQLException {
        Moto moto = new Moto();
        moto.setId(rs.getLong("id"));
        moto.setModelo(rs.getString("modelo"));
        moto.setFabricante(rs.getString("fabricante"));
        moto.setAno(rs.getInt("ano"));
        moto.setCor(rs.getString("cor"));
        moto.setPreco(rs.getDouble("preco"));
        moto.setCilindradas(rs.getInt("cilindrada"));
        return moto;
    }

    private void close(Connection conn) { if (conn != null) try { conn.close(); } catch (SQLException e) { /* Logar */ } }
    private void close(Statement stmt) { if (stmt != null) try { stmt.close(); } catch (SQLException e) { /* Logar */ } }
    private void close(ResultSet rs) { if (rs != null) try { rs.close(); } catch (SQLException e) { /* Logar */ } }

}
