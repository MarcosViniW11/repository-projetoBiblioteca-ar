package com.BibliotecaRetomada.DesafioBiblioteca.repository;

import com.BibliotecaRetomada.DesafioBiblioteca.model.Livro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LivroRepository extends JpaRepository<Livro, Long> {

    Optional<Livro> findByIsbn(String isbn);

    boolean existsByIsbn(String isbn);

    List<Livro> findByTituloContainingIgnoreCase(String titulo);

    List<Livro> findByAutorId(Long autorId);

    List<Livro> findByCategoriaId(Long categoriaId);

    List<Livro> findByAnoPublicacao(Integer anoPublicacao);
}
