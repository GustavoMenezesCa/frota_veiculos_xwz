package org.example.web.controller;

import org.example.domain.Veiculo;
import org.example.service.VeiculoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/veiculo")
public class VeiculoController {

    private final VeiculoService veiculoService;

    public VeiculoController(VeiculoService veiculoService){
        this.veiculoService = veiculoService;
    }

    @DeleteMapping("/excluir/{Id}")
    public ResponseEntity<Object> excluirVeiculo(@PathVariable(value = "Id") Long id){

        veiculoService.excluirVeiculo(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }



}
