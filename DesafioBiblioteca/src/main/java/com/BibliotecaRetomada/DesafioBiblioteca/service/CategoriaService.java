package com.BibliotecaRetomada.DesafioBiblioteca.service;

import com.BibliotecaRetomada.DesafioBiblioteca.dto.request.CategoriaRequest;
import com.BibliotecaRetomada.DesafioBiblioteca.dto.response.CategoriaResponse;
import com.BibliotecaRetomada.DesafioBiblioteca.model.Categoria;
import com.BibliotecaRetomada.DesafioBiblioteca.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public List<CategoriaResponse> listarTodos() {
        List<Categoria> categorias = categoriaRepository.findAll();
        List<CategoriaResponse> categoriasResponse = new ArrayList<>();
        for (Categoria categoria : categorias) {
            CategoriaResponse categoriaResponse = new CategoriaResponse();
            categoriaResponse.setId(categoria.getId());
            categoriaResponse.setNome(categoria.getNome());
            categoriaResponse.setDescricao(categoria.getDescricao());
            categoriasResponse.add(categoriaResponse);
        }
        return categoriasResponse;
    }

    public Categoria buscarPorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Categoria não encontrada."));
    }

    public CategoriaResponse cadastrar(CategoriaRequest request) {

        if (categoriaRepository.existsByNome(request.getNome())) {
            throw new RuntimeException("Já existe uma categoria com esse nome.");
        }

        Categoria categoria = new Categoria();

        categoria.setNome(request.getNome());
        categoria.setDescricao(request.getDescricao());

        categoriaRepository.save(categoria);

        CategoriaResponse categoriaResponse = new CategoriaResponse();
        categoriaResponse.setId(categoria.getId());
        categoriaResponse.setNome(categoria.getNome());
        categoriaResponse.setDescricao(categoria.getDescricao());
        return categoriaResponse;
    }

    public CategoriaResponse atualizar(Long id, CategoriaRequest request) {

        Categoria categoria = buscarPorId(id);

        categoria.setNome(request.getNome());
        categoria.setDescricao(request.getDescricao());

        categoriaRepository.save(categoria);

        CategoriaResponse categoriaResponse = new CategoriaResponse();
        categoriaResponse.setId(categoria.getId());
        categoriaResponse.setNome(categoria.getNome());
        categoriaResponse.setDescricao(categoria.getDescricao());
        return categoriaResponse;
    }

    public void deletar(Long id) {

        Categoria categoria = buscarPorId(id);

        categoriaRepository.delete(categoria);
    }



}
