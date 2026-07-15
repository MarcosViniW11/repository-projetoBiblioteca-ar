package com.BibliotecaRetomada.DesafioBiblioteca.dto.response;

import lombok.Data;

@Data
public class LivroResponse {

    private Long id;

    private String titulo;

    private String isbn;

    private Integer anoPublicacao;

    private String editora;

    private Integer quantidadeTotal;

    private Integer quantidadeDisponivel;

    private String descricao;

    private String autor;

    private String categoria;

}
