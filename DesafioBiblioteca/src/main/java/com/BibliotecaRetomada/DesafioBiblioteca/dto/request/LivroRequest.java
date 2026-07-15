package com.BibliotecaRetomada.DesafioBiblioteca.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LivroRequest {
    @NotBlank
    private String titulo;

    @NotBlank
    private String isbn;

    @NotNull
    private Integer anoPublicacao;

    private String editora;

    @NotNull
    private Integer quantidadeTotal;

    private String descricao;

    @NotNull
    private Long autorId;

    @NotNull
    private Long categoriaId;

}
