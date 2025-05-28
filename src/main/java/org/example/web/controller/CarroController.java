package org.example.web.controller;

import org.example.domain.Carro;
import org.example.domain.Veiculo;
import org.example.service.CarroService;
import org.example.service.VeiculoService;
import org.example.web.dto.CarroCadastroForm;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/carro")
public class CarroController {

    private final CarroService carroService;

    private final VeiculoService veiculoService;

    public CarroController(CarroService carroService, VeiculoService veiculoService){
        this.carroService = carroService;
        this.veiculoService = veiculoService;
    }


    @PostMapping("/cadastro")
    public ResponseEntity<Object> cadastraCarro(@RequestBody CarroCadastroForm carroCadastroForm){

        Carro carro = carroService.cadastraCarro(carroCadastroForm);

        return ResponseEntity.status(HttpStatus.OK).body(carro);
    }

    @PutMapping("/atualizarVeiculo/{id}")
    public ResponseEntity<Carro> atualizarVeiculo(@PathVariable(value = "id") Long id,
                                                  @RequestBody CarroCadastroForm carroCadastroForm){

        Carro carro = carroService.findByid(id);
        Carro carroSalvo = carroService.atualizarCarro(carro, carroCadastroForm);
        return ResponseEntity.status(HttpStatus.OK).body(carro);
    }

}


