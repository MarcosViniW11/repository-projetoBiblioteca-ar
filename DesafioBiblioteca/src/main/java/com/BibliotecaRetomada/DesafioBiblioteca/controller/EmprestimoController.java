package com.BibliotecaRetomada.DesafioBiblioteca.controller;

import com.BibliotecaRetomada.DesafioBiblioteca.dto.request.EmprestimoRequest;
import com.BibliotecaRetomada.DesafioBiblioteca.dto.response.EmprestimoResponse;
import com.BibliotecaRetomada.DesafioBiblioteca.service.EmprestimoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/emprestimos")
@RequiredArgsConstructor
public class EmprestimoController {

    private final EmprestimoService emprestimoService;

    @PostMapping
    public ResponseEntity<EmprestimoResponse> emprestar(@RequestBody EmprestimoRequest request) {
        return ResponseEntity.ok(emprestimoService.emprestar(request));
    }

    @PutMapping("/{id}/devolver")
    public ResponseEntity<EmprestimoResponse> devolver(@PathVariable Long id) {
        return ResponseEntity.ok(emprestimoService.devolver(id));
    }

    @GetMapping("/meus")
    public ResponseEntity<List<EmprestimoResponse>> meusEmprestimos() {
        return ResponseEntity.ok(emprestimoService.meusEmprestimos());
    }

    @GetMapping
    public ResponseEntity<List<EmprestimoResponse>> listarTodos() {
        return ResponseEntity.ok(emprestimoService.listarTodos());
    }

    /*
    @PostMapping("/atualizar-atrasados")
    public ResponseEntity<Void> atualizarAtrasados() {
        emprestimoService.atualizarAtrasados();
        return ResponseEntity.ok().build();
    }*/
}
