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


    @GetMapping("/consultar/todos")
    public ResponseEntity<List<Veiculo>> listarVeiculos(){
        List<Veiculo> listaVeiculos = veiculoService.listarVeiculosCadastrados();
        return ResponseEntity.status(HttpStatus.OK).body(listaVeiculos);
    }

    @GetMapping("/consultar")
    public ResponseEntity<List<Veiculo>> consultarVeiculosFiltrados(
            @RequestParam(name = "tipo", required = false) String tipo,
            @RequestParam(name = "modelo", required = false) String modelo,
            @RequestParam(name = "cor", required = false) String cor,
            @RequestParam(name = "ano", required = false) Integer ano) {

        String tipoFiltro = (tipo != null && !tipo.trim().isEmpty()) ? tipo.trim().toUpperCase() : null;
        Integer anoFiltro = (ano != null && ano <= 0) ? null : ano;

        List<Veiculo> veiculosFiltrados = veiculoService.consultarVeiculos(tipoFiltro, modelo, cor, anoFiltro);

        return ResponseEntity.status(HttpStatus.OK).body(veiculosFiltrados);
    }

    @GetMapping("/consultar/{id}")
    public ResponseEntity<Veiculo> findById(@PathVariable(value = "id") Long id){

        Veiculo veiculo = veiculoService.findById(id);
        return ResponseEntity.status(HttpStatus.OK).body(veiculo);

    }
}
