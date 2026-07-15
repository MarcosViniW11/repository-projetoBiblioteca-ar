package com.BibliotecaRetomada.DesafioBiblioteca.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AlterarSenhaRequest {
    @NotBlank
    private String senhaAtual;

    @NotBlank
    private String novaSenha;
}
