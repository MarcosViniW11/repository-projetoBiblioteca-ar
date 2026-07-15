package com.BibliotecaRetomada.DesafioBiblioteca.dto.response;

import com.BibliotecaRetomada.DesafioBiblioteca.model.StatusEmprestimo;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EmprestimoResponse {

    private Long id;

    private LocalDate dataEmprestimo;

    private LocalDate dataPrevistaDevolucao;

    private LocalDate dataDevolucao;

    private StatusEmprestimo status;

    private String usuario;

    private String livro;

}
