package com.BibliotecaRetomada.DesafioBiblioteca.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EmprestimoRequest {
    @NotNull
    private Long livroId;
}
