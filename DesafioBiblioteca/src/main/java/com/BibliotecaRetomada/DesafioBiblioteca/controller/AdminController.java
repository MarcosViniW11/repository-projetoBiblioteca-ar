package com.BibliotecaRetomada.DesafioBiblioteca.controller;

import com.BibliotecaRetomada.DesafioBiblioteca.dto.request.*;
import com.BibliotecaRetomada.DesafioBiblioteca.dto.response.*;
import com.BibliotecaRetomada.DesafioBiblioteca.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final LivroService livroService;
    private final AutorService autorService;
    private final CategoriaService categoriaService;
    private final UsuarioService usuarioService;
    private final EmprestimoService emprestimoService;


    @PostMapping("/livros")
    public ResponseEntity<LivroResponse> cadastrarLivro(@RequestBody @Valid LivroRequest request){
        return ResponseEntity.ok(
                livroService.cadastrar(request)
        );
    }

    @PutMapping("/livros/{id}")
    public ResponseEntity<LivroResponse> atualizarLivro(@PathVariable Long id,@RequestBody @Valid LivroRequest request){
        return ResponseEntity.ok(
                livroService.atualizar(id,request));
    }

    @DeleteMapping("/livros/{id}")
    public ResponseEntity<LivroResponse> deletarLivro(@PathVariable Long id){
        livroService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/autores")
    public ResponseEntity<AutorResponse> criarAutores(@RequestBody AutorRequest request) {
        return ResponseEntity.ok(autorService.cadastrar(request));
    }

    @PutMapping("/autores/{id}")
    public ResponseEntity<AutorResponse> atualizarAutor(@PathVariable Long id,
                                                   @RequestBody AutorRequest request) {
        return ResponseEntity.ok(autorService.atualizar(id, request));
    }

    @DeleteMapping("/autores/{id}")
    public ResponseEntity<Void> deletarAutor(@PathVariable Long id) {
        autorService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/categorias")
    public ResponseEntity<CategoriaResponse> criar(@RequestBody CategoriaRequest request) {
        return ResponseEntity.ok(categoriaService.cadastrar(request));
    }

    @PutMapping("/categorias/{id}")
    public ResponseEntity<CategoriaResponse> atualizar(@PathVariable Long id,
                                                       @RequestBody CategoriaRequest request) {
        return ResponseEntity.ok(categoriaService.atualizar(id, request));
    }

    @DeleteMapping("/categorias/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        categoriaService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("usuarios/{id}")
    public ResponseEntity<UsuarioResponse> atualizar(@PathVariable Long id,
                                                     @RequestBody UsuarioRequest request) {
        return ResponseEntity.ok(usuarioService.atualizarPerfil(id, request));
    }

    @PutMapping("usuarios/{id}/senha")
    public ResponseEntity<Void> alterarSenha(@PathVariable Long id,
                                             @RequestBody AlterarSenhaRequest request) {
        usuarioService.alterarSenha(id, request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("emprestimos/{id}/devolver")
    public ResponseEntity<EmprestimoResponse> devolver(@PathVariable Long id) {
        return ResponseEntity.ok(emprestimoService.devolver(id));
    }

    @PostMapping("emprestimos/atualizar-atrasados")
    public ResponseEntity<Void> atualizarAtrasados() {
        emprestimoService.atualizarAtrasados();
        return ResponseEntity.ok().build();
    }
}
