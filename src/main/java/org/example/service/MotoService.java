package org.example.service;

import org.example.dao.MotoDAO;
import org.example.domain.Moto;
import org.example.web.dto.MotoCadastroForm;
import org.springframework.stereotype.Service;

import java.sql.SQLException;

@Service
public class MotoService {

    private final MotoDAO motoDAO;

    public MotoService(MotoDAO motoDAO){
        this.motoDAO = motoDAO;
    }

    public Moto cadastraMoto(MotoCadastroForm motoCadastroForm){
        System.out.println(motoCadastroForm);
        if (motoCadastroForm.modelo() == null || motoCadastroForm.fabricante() == null || motoCadastroForm.ano() == null ||
                motoCadastroForm.preco() == null || motoCadastroForm.cilindradas() == null) {
            throw new IllegalArgumentException("Todos os campos são obrigatórios para cadastro de uma moto.");
        }
        Moto moto = Moto.fromDto(motoCadastroForm);
        try {
            motoDAO.cadastrarMoto(moto);
            return moto;
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao salvar a moto no banco de dados.", e);
        }
    }



    public Moto atualizarMoto(Moto moto, MotoCadastroForm motoCadastroForm){
        moto.atualizaDados(motoCadastroForm);
        return motoDAO.atualizar(moto);
    }

    public Moto findByid(Long id){
        return motoDAO.buscarPorId(id).orElseThrow();
    }
}
