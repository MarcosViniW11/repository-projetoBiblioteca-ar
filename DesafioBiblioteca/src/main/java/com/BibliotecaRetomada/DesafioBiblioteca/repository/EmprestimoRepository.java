package com.BibliotecaRetomada.DesafioBiblioteca.repository;

import com.BibliotecaRetomada.DesafioBiblioteca.model.Emprestimo;
import com.BibliotecaRetomada.DesafioBiblioteca.model.StatusEmprestimo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {
    List<Emprestimo> findByUsuarioId(Long usuarioId);

    List<Emprestimo> findByLivroId(Long livroId);

    List<Emprestimo> findByStatus(StatusEmprestimo status);

    boolean existsByUsuarioIdAndLivroIdAndStatus(
            Long usuarioId,
            Long livroId,
            StatusEmprestimo status
    );
}
