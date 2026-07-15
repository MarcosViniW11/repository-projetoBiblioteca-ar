package com.BibliotecaRetomada.DesafioBiblioteca.repository;

import com.BibliotecaRetomada.DesafioBiblioteca.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    Optional<Categoria> findByNome(String nome);

    List<Categoria> findByNomeContainingIgnoreCase(String nome);

    boolean existsByNome(String nome);

}
