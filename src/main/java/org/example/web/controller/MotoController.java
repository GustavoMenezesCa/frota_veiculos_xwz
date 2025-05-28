package org.example.web.controller;

import org.example.domain.Moto;
import org.example.service.MotoService;
import org.example.service.VeiculoService;
import org.example.web.dto.MotoCadastroForm;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/moto")
public class MotoController {

    private final MotoService motoService;

    private final VeiculoService veiculoService;

    public MotoController(MotoService motoService, VeiculoService veiculoService){
        this.motoService = motoService;
        this.veiculoService = veiculoService;
    }


    @PostMapping("/cadastro")
    public ResponseEntity<Object> cadastroMoto(@RequestBody MotoCadastroForm motoCadastroForm){

        Moto moto = motoService.cadastraMoto(motoCadastroForm);

        return ResponseEntity.status(HttpStatus.OK).body(moto);
    }

    @PutMapping("/atualizarMoto/{id}")
    public ResponseEntity<Moto> atualizarVeiculo(@PathVariable(value = "id") Long id,
                                                  @RequestBody MotoCadastroForm motoCadastroForm){

        Moto moto = motoService.findByid(id);

        Moto motoSalva = motoService.atualizarMoto(moto, motoCadastroForm);
        return ResponseEntity.status(HttpStatus.OK).body(moto);
    }


}
