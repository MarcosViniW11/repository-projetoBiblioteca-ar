package com.BibliotecaRetomada.DesafioBiblioteca.service;

import com.BibliotecaRetomada.DesafioBiblioteca.dto.request.LivroRequest;
import com.BibliotecaRetomada.DesafioBiblioteca.dto.response.LivroResponse;
import com.BibliotecaRetomada.DesafioBiblioteca.model.Autor;
import com.BibliotecaRetomada.DesafioBiblioteca.model.Categoria;
import com.BibliotecaRetomada.DesafioBiblioteca.model.Livro;
import com.BibliotecaRetomada.DesafioBiblioteca.repository.AutorRepository;
import com.BibliotecaRetomada.DesafioBiblioteca.repository.LivroRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LivroService {

    private final LivroRepository livroRepository;
    private final AutorService autorService;
    private final CategoriaService categoriaService;
    private final AutorRepository autorRepository;

    public LivroService(LivroRepository livroRepository, AutorService autorService, CategoriaService categoriaService, AutorRepository autorRepository) {
        this.livroRepository = livroRepository;
        this.autorService = autorService;
        this.categoriaService = categoriaService;
        this.autorRepository = autorRepository;
    }

    public List<LivroResponse> listarTodos() {
        List<Livro> livros = livroRepository.findAll();
        List<LivroResponse> livrosResponse = new ArrayList<>();
        for (Livro livro : livros) {
            LivroResponse livroResponse = new LivroResponse();
            livroResponse.setId(livro.getId());
            livroResponse.setTitulo(livro.getTitulo());
            livroResponse.setIsbn(livro.getIsbn());
            livroResponse.setAnoPublicacao(livro.getAnoPublicacao());
            livroResponse.setEditora(livro.getEditora());
            livroResponse.setQuantidadeTotal(livro.getQuantidadeTotal());
            livroResponse.setQuantidadeDisponivel(livro.getQuantidadeDisponivel());
            livroResponse.setDescricao(livro.getDescricao());
            livroResponse.setAutor(livro.getDescricao());
            livroResponse.setCategoria(livro.getDescricao());
            livrosResponse.add(livroResponse);
        }
        return livrosResponse;
        //return livroRepository.findAll();
    }

    public LivroResponse buscarPorId(Long id) {
        Livro livro = livroRepository.findById(id).orElseThrow(()->new RuntimeException("Livro não Encontrado!"));
        LivroResponse livroResponse = new LivroResponse();
        livroResponse.setId(livro.getId());
        livroResponse.setTitulo(livro.getTitulo());
        livroResponse.setIsbn(livro.getIsbn());
        livroResponse.setAnoPublicacao(livro.getAnoPublicacao());
        livroResponse.setEditora(livro.getEditora());
        livroResponse.setQuantidadeTotal(livro.getQuantidadeTotal());
        livroResponse.setQuantidadeDisponivel(livro.getQuantidadeDisponivel());
        livroResponse.setDescricao(livro.getDescricao());
        livroResponse.setAutor(livro.getDescricao());
        livroResponse.setCategoria(livro.getDescricao());
        return livroResponse;
    }

    public LivroResponse cadastrar(LivroRequest request) {

        if (livroRepository.existsByIsbn(request.getIsbn())) {
            throw new RuntimeException("ISBN já cadastrado.");
        }

        Autor autor = autorRepository.findById(request.getAutorId()).orElseThrow(()->new RuntimeException("Autor não encontrado."));
        Categoria categoria = categoriaService.buscarPorId(request.getCategoriaId());

        Livro livro = new Livro();

        livro.setTitulo(request.getTitulo());
        livro.setIsbn(request.getIsbn());
        livro.setAnoPublicacao(request.getAnoPublicacao());
        livro.setEditora(request.getEditora());
        livro.setQuantidadeTotal(request.getQuantidadeTotal());

        // Quando o livro é cadastrado,
        // todas as unidades estão disponíveis.
        livro.setQuantidadeDisponivel(request.getQuantidadeTotal());

        livro.setDescricao(request.getDescricao());

        livro.setAutor(autor);
        livro.setCategoria(categoria);

        livroRepository.save(livro);

        LivroResponse livroResponse = new LivroResponse();
        livroResponse.setId(livro.getId());
        livroResponse.setTitulo(livro.getTitulo());
        livroResponse.setIsbn(livro.getIsbn());
        livroResponse.setAnoPublicacao(livro.getAnoPublicacao());
        livroResponse.setEditora(livro.getEditora());
        livroResponse.setQuantidadeTotal(livro.getQuantidadeTotal());
        livroResponse.setQuantidadeDisponivel(livro.getQuantidadeDisponivel());
        livroResponse.setDescricao(livro.getDescricao());
        livroResponse.setAutor(livro.getDescricao());
        livroResponse.setCategoria(livro.getDescricao());
        return livroResponse;
    }

    public LivroResponse atualizar(Long id, LivroRequest request) {

        Long livroId = buscarPorId(id).getId();
        Livro livro = livroRepository.findById(livroId).orElseThrow(()->new RuntimeException("Livro não Encontrado!"));

        Autor autor = autorRepository.findById(request.getAutorId()).orElseThrow(()->new RuntimeException("Autor não encontrado."));
        Categoria categoria = categoriaService.buscarPorId(request.getCategoriaId());

        if (!livro.getIsbn().equals(request.getIsbn())
                && livroRepository.existsByIsbn(request.getIsbn())) {

            throw new RuntimeException("ISBN já cadastrado.");
        }

        livro.setTitulo(request.getTitulo());
        livro.setIsbn(request.getIsbn());
        livro.setAnoPublicacao(request.getAnoPublicacao());
        livro.setEditora(request.getEditora());
        livro.setDescricao(request.getDescricao());

        livro.setAutor(autor);
        livro.setCategoria(categoria);

        livroRepository.save(livro);

        LivroResponse livroResponse = new LivroResponse();
        livroResponse.setId(livro.getId());
        livroResponse.setTitulo(livro.getTitulo());
        livroResponse.setIsbn(livro.getIsbn());
        livroResponse.setAnoPublicacao(livro.getAnoPublicacao());
        livroResponse.setEditora(livro.getEditora());
        livroResponse.setQuantidadeTotal(livro.getQuantidadeTotal());
        livroResponse.setQuantidadeDisponivel(livro.getQuantidadeDisponivel());
        livroResponse.setDescricao(livro.getDescricao());
        livroResponse.setAutor(livro.getDescricao());
        livroResponse.setCategoria(livro.getDescricao());
        return livroResponse;
    }

    public void excluir(Long id) {

        Long livroId = buscarPorId(id).getId();
        Livro livro = livroRepository.findById(livroId).orElseThrow(()->new RuntimeException("Livro não Encontrado!"));

        livroRepository.delete(livro);
    }

    public List<LivroResponse> buscarPorTitulo(String titulo) {
        List<Livro> livros = livroRepository.findByTituloContainingIgnoreCase(titulo);
        List<LivroResponse> listaLivroResponse = new ArrayList<>();
        for (Livro livro : livros) {
            LivroResponse livroResponse = new LivroResponse();
            livroResponse.setId(livro.getId());
            livroResponse.setTitulo(livro.getTitulo());
            livroResponse.setIsbn(livro.getIsbn());
            livroResponse.setAnoPublicacao(livro.getAnoPublicacao());
            livroResponse.setEditora(livro.getEditora());
            livroResponse.setQuantidadeTotal(livro.getQuantidadeTotal());
            livroResponse.setQuantidadeDisponivel(livro.getQuantidadeDisponivel());
            livroResponse.setDescricao(livro.getDescricao());
            livroResponse.setAutor(livro.getDescricao());
            livroResponse.setCategoria(livro.getDescricao());
            listaLivroResponse.add(livroResponse);
        }
        return listaLivroResponse;
    }

}
