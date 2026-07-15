package com.BibliotecaRetomada.DesafioBiblioteca.service;

import com.BibliotecaRetomada.DesafioBiblioteca.dto.request.EmprestimoRequest;
import com.BibliotecaRetomada.DesafioBiblioteca.dto.response.EmprestimoResponse;
import com.BibliotecaRetomada.DesafioBiblioteca.exception.BusinessException;
import com.BibliotecaRetomada.DesafioBiblioteca.model.*;
import com.BibliotecaRetomada.DesafioBiblioteca.repository.EmprestimoRepository;
import com.BibliotecaRetomada.DesafioBiblioteca.repository.LivroRepository;
import com.BibliotecaRetomada.DesafioBiblioteca.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmprestimoService {


    private final EmprestimoRepository emprestimoRepository;
    private final LivroRepository livroRepository;
    private final UsuarioRepository usuarioRepository;

    // =========================
    // EMPRESTAR LIVRO
    // =========================
    public EmprestimoResponse emprestar(EmprestimoRequest request) {

        Usuario usuario = getUsuarioLogado();

        Livro livro = livroRepository.findById(request.getLivroId())
                .orElseThrow(() -> new RuntimeException("Livro não encontrado."));

        if (livro.getQuantidadeDisponivel() <= 0) {
            throw new RuntimeException("Livro indisponível no momento.");
        }

        boolean jaEmprestado = emprestimoRepository
                .existsByUsuarioIdAndLivroIdAndStatus(
                        usuario.getId(),
                        livro.getId(),
                        StatusEmprestimo.EMPRESTADO
                );

        if (jaEmprestado) {
            throw new RuntimeException("Você já possui este livro emprestado.");
        }

        livro.setQuantidadeDisponivel(livro.getQuantidadeDisponivel() - 1);
        livroRepository.save(livro);

        Emprestimo emprestimo = new Emprestimo();
        emprestimo.setUsuario(usuario);
        emprestimo.setLivro(livro);
        emprestimo.setDataEmprestimo(LocalDate.now());
        emprestimo.setDataPrevistaDevolucao(LocalDate.now().plusDays(15));
        emprestimo.setStatus(StatusEmprestimo.EMPRESTADO);

        emprestimoRepository.save(emprestimo);

        return toResponse(emprestimo);
    }

    // =========================
    // DEVOLVER LIVRO
    // =========================
    public EmprestimoResponse devolver(Long emprestimoId) {

        Emprestimo emprestimo = emprestimoRepository.findById(emprestimoId)
                .orElseThrow(() -> new RuntimeException("Empréstimo não encontrado."));

        if (emprestimo.getStatus() == StatusEmprestimo.DEVOLVIDO) {
            throw new BusinessException("Este livro já foi devolvido.");
        }

        emprestimo.setDataDevolucao(LocalDate.now());
        emprestimo.setStatus(StatusEmprestimo.DEVOLVIDO);

        Livro livro = emprestimo.getLivro();
        livro.setQuantidadeDisponivel(livro.getQuantidadeDisponivel() + 1);

        livroRepository.save(livro);
        emprestimoRepository.save(emprestimo);

        return toResponse(emprestimo);
    }

    // =========================
    // LISTAR MEUS EMPRESTIMOS
    // =========================
    public List<EmprestimoResponse> meusEmprestimos() {

        Usuario usuario = getUsuarioLogado();

        return emprestimoRepository.findByUsuarioId(usuario.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // =========================
    // LISTAR TODOS (ADMIN)
    // =========================
    public List<EmprestimoResponse> listarTodos() {

        return emprestimoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // =========================
    // ATUALIZAR ATRASADOS
    // =========================
    public void atualizarAtrasados() {

        List<Emprestimo> emprestimos = emprestimoRepository.findAll();

        LocalDate hoje = LocalDate.now();

        for (Emprestimo e : emprestimos) {

            if (e.getStatus() == StatusEmprestimo.EMPRESTADO &&
                    e.getDataPrevistaDevolucao().isBefore(hoje)) {

                e.setStatus(StatusEmprestimo.ATRASADO);
                emprestimoRepository.save(e);
            }
        }
    }

    // =========================
    // MAPEAMENTO DTO
    // =========================
    private EmprestimoResponse toResponse(Emprestimo e) {

        EmprestimoResponse response = new EmprestimoResponse();

        response.setId(e.getId());
        response.setDataEmprestimo(e.getDataEmprestimo());
        response.setDataPrevistaDevolucao(e.getDataPrevistaDevolucao());
        response.setDataDevolucao(e.getDataDevolucao());
        response.setStatus(e.getStatus());

        response.setUsuario(e.getUsuario().getNome());
        response.setLivro(e.getLivro().getTitulo());

        return response;
    }

    // =========================
    // USUARIO LOGADO
    // =========================
    private Usuario getUsuarioLogado() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getName();

        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    }
}
