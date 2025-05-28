package org.example.web.controller;

import org.example.domain.Moto;
import org.example.service.MotoService;

import org.example.web.dto.MotoCadastroForm;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/moto")
public class MotoController {

    private final MotoService motoService;



    public MotoController(MotoService motoService) {
        this.motoService = motoService;
    }


    @PostMapping("/cadastro")
    public ResponseEntity<Object> cadastroMoto(@RequestBody MotoCadastroForm motoCadastroForm){

        Moto moto = motoService.cadastraMoto(motoCadastroForm);

        return ResponseEntity.status(HttpStatus.OK).body(moto);
    }

}
