package com.BibliotecaRetomada.DesafioBiblioteca.controller;

import com.BibliotecaRetomada.DesafioBiblioteca.dto.request.AlterarSenhaRequest;
import com.BibliotecaRetomada.DesafioBiblioteca.dto.request.UsuarioRequest;
import com.BibliotecaRetomada.DesafioBiblioteca.dto.response.UsuarioResponse;
import com.BibliotecaRetomada.DesafioBiblioteca.model.Usuario;
import com.BibliotecaRetomada.DesafioBiblioteca.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listar() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> me(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(usuarioService.me(email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> atualizar(@PathVariable Long id,
                                             @RequestBody UsuarioRequest request) {
        return ResponseEntity.ok(usuarioService.atualizarPerfil(id, request));
    }

    @PutMapping("/{id}/senha")
    public ResponseEntity<Void> alterarSenha(@PathVariable Long id,
                                             @RequestBody AlterarSenhaRequest request) {
        usuarioService.alterarSenha(id, request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/atualizarCadastro")
    public ResponseEntity<UsuarioResponse> atualizarCadastro(@RequestBody UsuarioRequest usuario,Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(usuarioService.atualizarPerfilPeloEmail(email, usuario));
    }

    @PutMapping("/alterarSenhaCadastro/senha")
    public ResponseEntity<Void> alterarSenhaEmail(@RequestBody AlterarSenhaRequest request,Authentication authentication) {
        String email = authentication.getName();
        usuarioService.alterarSenhaEmail(email, request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/deletar/me")
    public ResponseEntity<Void> deletarMe(Authentication authentication) {
        String email = authentication.getName();
        usuarioService.excluirCadastro(email);
        return ResponseEntity.noContent().build();
    }

}
