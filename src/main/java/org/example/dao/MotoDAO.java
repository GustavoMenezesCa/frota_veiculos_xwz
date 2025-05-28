package org.example.dao;

import org.example.domain.Moto;

import java.sql.SQLException;
import java.util.Optional;

public interface MotoDAO {

    Moto cadastrarMoto(Moto moto) throws SQLException;
    Moto atualizar(Moto moto);
    Optional<Moto> buscarPorId(Long id);
}
