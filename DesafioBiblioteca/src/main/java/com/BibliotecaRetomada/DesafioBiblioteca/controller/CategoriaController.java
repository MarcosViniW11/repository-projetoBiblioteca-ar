package com.BibliotecaRetomada.DesafioBiblioteca.controller;

import com.BibliotecaRetomada.DesafioBiblioteca.dto.request.CategoriaRequest;
import com.BibliotecaRetomada.DesafioBiblioteca.dto.response.CategoriaResponse;
import com.BibliotecaRetomada.DesafioBiblioteca.model.Categoria;
import com.BibliotecaRetomada.DesafioBiblioteca.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService categoriaService;

    @GetMapping
    public ResponseEntity<List<CategoriaResponse>> listar() {
        return ResponseEntity.ok(categoriaService.listarTodos());
    }

    /*

    @PostMapping
    public ResponseEntity<CategoriaResponse> criar(@RequestBody CategoriaRequest request) {
        return ResponseEntity.ok(categoriaService.cadastrar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponse> atualizar(@PathVariable Long id,
                                               @RequestBody CategoriaRequest request) {
        return ResponseEntity.ok(categoriaService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        categoriaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
    */

}
