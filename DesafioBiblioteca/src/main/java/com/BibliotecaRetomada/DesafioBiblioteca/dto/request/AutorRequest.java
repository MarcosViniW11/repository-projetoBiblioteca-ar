package com.BibliotecaRetomada.DesafioBiblioteca.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AutorRequest {

    @NotBlank
    private String nome;

    private String nacionalidade;

    private String biografia;
}
