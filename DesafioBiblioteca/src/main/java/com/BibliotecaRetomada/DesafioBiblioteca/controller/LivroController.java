package com.BibliotecaRetomada.DesafioBiblioteca.controller;

import com.BibliotecaRetomada.DesafioBiblioteca.dto.request.LivroRequest;
import com.BibliotecaRetomada.DesafioBiblioteca.dto.response.LivroResponse;
import com.BibliotecaRetomada.DesafioBiblioteca.model.Livro;
import com.BibliotecaRetomada.DesafioBiblioteca.service.LivroService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/livros")
@RequiredArgsConstructor
public class LivroController {

    private final LivroService livroService;

    @GetMapping
    public ResponseEntity<List<LivroResponse>> listar() {
        return ResponseEntity.ok(livroService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LivroResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(livroService.buscarPorId(id));
    }

    /*

    @PostMapping
    public ResponseEntity<LivroResponse> cadastrar(@RequestBody LivroRequest request) {
        return ResponseEntity.ok(livroService.cadastrar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LivroResponse> atualizar(@PathVariable Long id,
                                           @RequestBody LivroRequest request) {
        return ResponseEntity.ok(livroService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        livroService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    */
    @GetMapping("/buscar")
    public ResponseEntity<List<LivroResponse>> buscarPorTitulo(@RequestParam String titulo) {
        return ResponseEntity.ok(livroService.buscarPorTitulo(titulo));
    }
}
