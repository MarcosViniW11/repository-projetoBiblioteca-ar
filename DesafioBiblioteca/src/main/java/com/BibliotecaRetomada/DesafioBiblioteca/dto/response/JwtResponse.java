package com.BibliotecaRetomada.DesafioBiblioteca.dto.response;

import com.BibliotecaRetomada.DesafioBiblioteca.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private Role role;
}
