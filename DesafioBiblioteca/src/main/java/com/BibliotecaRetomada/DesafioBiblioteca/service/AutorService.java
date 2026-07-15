package com.BibliotecaRetomada.DesafioBiblioteca.service;

import com.BibliotecaRetomada.DesafioBiblioteca.dto.request.AutorRequest;
import com.BibliotecaRetomada.DesafioBiblioteca.dto.response.AutorResponse;
import com.BibliotecaRetomada.DesafioBiblioteca.model.Autor;
import com.BibliotecaRetomada.DesafioBiblioteca.repository.AutorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AutorService {

    private final AutorRepository autorRepository;

    public List<AutorResponse> listarTodos() {
        List<Autor> autores = autorRepository.findAll();
        List<AutorResponse> responses = new ArrayList<>();
        for (Autor autor : autores) {
            AutorResponse autorResponse = new AutorResponse();
            autorResponse.setId(autor.getId());
            autorResponse.setNome(autor.getNome());
            autorResponse.setNacionalidade(autor.getNacionalidade());
            autorResponse.setBiografia(autor.getBiografia());
            responses.add(autorResponse);
        }
        return responses;
    }

    public AutorResponse buscarPorId(Long id) {
        Autor autor = autorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Autor não encontrado."));
        AutorResponse autorResponse = new AutorResponse();
        autorResponse.setId(autor.getId());
        autorResponse.setNome(autor.getNome());
        autorResponse.setNacionalidade(autor.getNacionalidade());
        autorResponse.setBiografia(autor.getBiografia());
        return autorResponse;
    }

    public AutorResponse cadastrar(AutorRequest request) {

        if (autorRepository.existsByNome(request.getNome())) {
            throw new RuntimeException("Já existe um autor com esse nome.");
        }

        Autor autor = new Autor();

        autor.setNome(request.getNome());
        autor.setNacionalidade(request.getNacionalidade());
        autor.setBiografia(request.getBiografia());

        autorRepository.save(autor);

        AutorResponse autorResponse = new AutorResponse();
        autorResponse.setId(autor.getId());
        autorResponse.setNome(autor.getNome());
        autorResponse.setNacionalidade(autor.getNacionalidade());
        autorResponse.setBiografia(autor.getBiografia());
        return autorResponse;
    }

    public AutorResponse atualizar(Long id, AutorRequest request) {

        Long idAutor = buscarPorId(id).getId();
        Autor autor = autorRepository.findById(idAutor).orElseThrow(()->new RuntimeException("Autor não encontrado."));

        autor.setNome(request.getNome());
        autor.setNacionalidade(request.getNacionalidade());
        autor.setBiografia(request.getBiografia());

        autorRepository.save(autor);

        AutorResponse autorResponse = new AutorResponse();
        autorResponse.setId(autor.getId());
        autorResponse.setNome(autor.getNome());
        autorResponse.setNacionalidade(autor.getNacionalidade());
        autorResponse.setBiografia(autor.getBiografia());
        return autorResponse;
    }

    public void deletar(Long id) {

        Long idAutor = buscarPorId(id).getId();
        Autor autor = autorRepository.findById(idAutor).orElseThrow(()->new RuntimeException("Autor não encontrado."));

        autorRepository.delete(autor);
    }


}
