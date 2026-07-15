package com.BibliotecaRetomada.DesafioBiblioteca.repository;

import com.BibliotecaRetomada.DesafioBiblioteca.model.Autor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AutorRepository extends JpaRepository<Autor, Long> {
    Optional<Autor> findByNome(String nome);

    List<Autor> findByNomeContainingIgnoreCase(String nome);

    boolean existsByNome(String nome);
}
