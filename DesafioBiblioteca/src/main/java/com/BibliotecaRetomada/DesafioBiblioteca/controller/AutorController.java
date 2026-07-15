package com.BibliotecaRetomada.DesafioBiblioteca.controller;

import com.BibliotecaRetomada.DesafioBiblioteca.dto.request.AutorRequest;
import com.BibliotecaRetomada.DesafioBiblioteca.dto.response.AutorResponse;
import com.BibliotecaRetomada.DesafioBiblioteca.model.Autor;
import com.BibliotecaRetomada.DesafioBiblioteca.service.AutorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/autores")
@RequiredArgsConstructor
public class AutorController {

    private final AutorService autorService;

    @GetMapping
    public ResponseEntity<List<AutorResponse>> listar() {
        return ResponseEntity.ok(autorService.listarTodos());
    }
    /*
    @PostMapping
    public ResponseEntity<AutorResponse> criar(@RequestBody AutorRequest request) {
        return ResponseEntity.ok(autorService.cadastrar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AutorResponse> atualizar(@PathVariable Long id,
                                           @RequestBody AutorRequest request) {
        return ResponseEntity.ok(autorService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        autorService.deletar(id);
        return ResponseEntity.noContent().build();
    }
    */
}
