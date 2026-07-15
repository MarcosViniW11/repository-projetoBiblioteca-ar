package com.BibliotecaRetomada.DesafioBiblioteca.dto.response;

import com.BibliotecaRetomada.DesafioBiblioteca.model.Role;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UsuarioResponse {

    private Long id;

    private String nome;

    private String email;

    private String telefone;

    private LocalDateTime dataCadastro;

    private boolean ativo;

    private Role role;

}
