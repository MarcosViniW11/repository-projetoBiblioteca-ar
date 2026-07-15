package com.BibliotecaRetomada.DesafioBiblioteca.service;


import com.BibliotecaRetomada.DesafioBiblioteca.dto.request.AlterarSenhaRequest;
import com.BibliotecaRetomada.DesafioBiblioteca.dto.request.UsuarioRequest;
import com.BibliotecaRetomada.DesafioBiblioteca.dto.response.UsuarioResponse;
import com.BibliotecaRetomada.DesafioBiblioteca.exception.BusinessException;
import com.BibliotecaRetomada.DesafioBiblioteca.exception.UserNotFoundException;
import com.BibliotecaRetomada.DesafioBiblioteca.model.Usuario;
import com.BibliotecaRetomada.DesafioBiblioteca.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UsuarioResponse> listarTodos() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<UsuarioResponse> usuariosResponse = new ArrayList<>();
        for (Usuario usuario : usuarios) {
            UsuarioResponse usuarioResponse = new UsuarioResponse();
            usuarioResponse.setId(usuario.getId());
            usuarioResponse.setNome(usuario.getNome());
            usuarioResponse.setEmail(usuario.getEmail());
            usuarioResponse.setTelefone(usuario.getTelefone());
            usuarioResponse.setDataCadastro(usuario.getDataCadastro());
            usuarioResponse.setAtivo(usuario.isAtivo());
            usuarioResponse.setRole(usuario.getRole());
            usuariosResponse.add(usuarioResponse);
        }
        return usuariosResponse;
    }

    public UsuarioResponse buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException("Usuário não encontrado."));
        UsuarioResponse usuarioResponse = new UsuarioResponse();
        usuarioResponse.setId(usuario.getId());
        usuarioResponse.setNome(usuario.getNome());
        usuarioResponse.setEmail(usuario.getEmail());
        usuarioResponse.setTelefone(usuario.getTelefone());
        usuarioResponse.setDataCadastro(usuario.getDataCadastro());
        usuarioResponse.setAtivo(usuario.isAtivo());
        usuarioResponse.setRole(usuario.getRole());
        return usuarioResponse;
    }

    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("Usuário não encontrado."));
    }

    public UsuarioResponse atualizarPerfil(Long id, UsuarioRequest request) {

        Long idUsuario = buscarPorId(id).getId();
        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(()->new UserNotFoundException("Usuario Não Encontrado."));

        if (!usuario.getEmail().equals(request.getEmail())
                && usuarioRepository.existsByEmail(request.getEmail())) {

            throw new RuntimeException("E-mail já cadastrado.");
        }

        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setTelefone(request.getTelefone());

        usuarioRepository.save(usuario);

        UsuarioResponse usuarioResponse = new UsuarioResponse();
        usuarioResponse.setId(usuario.getId());
        usuarioResponse.setNome(usuario.getNome());
        usuarioResponse.setEmail(usuario.getEmail());
        usuarioResponse.setTelefone(usuario.getTelefone());
        usuarioResponse.setDataCadastro(usuario.getDataCadastro());
        usuarioResponse.setAtivo(usuario.isAtivo());
        usuarioResponse.setRole(usuario.getRole());

        return usuarioResponse;
    }

    public void alterarSenha(Long id, AlterarSenhaRequest request) {

        Long idUsuario = buscarPorId(id).getId();
        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(()->new UserNotFoundException("Usuario Não Encontrado."));

        if (!passwordEncoder.matches(request.getSenhaAtual(), usuario.getSenha())) {
            throw new RuntimeException("Senha atual incorreta.");
        }

        usuario.setSenha(passwordEncoder.encode(request.getNovaSenha()));

        usuarioRepository.save(usuario);
    }

    public UsuarioResponse atualizarPerfilPeloEmail(String email, UsuarioRequest request) {

        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(()->new UserNotFoundException("Usuario Não Encontrado."));

        if (!usuario.getEmail().equals(request.getEmail())
                && usuarioRepository.existsByEmail(request.getEmail())) {

            throw new RuntimeException("E-mail:"+ email +" já cadastrado!");
        }

        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setTelefone(request.getTelefone());

        usuarioRepository.save(usuario);

        UsuarioResponse usuarioResponse = new UsuarioResponse();
        usuarioResponse.setId(usuario.getId());
        usuarioResponse.setNome(usuario.getNome());
        usuarioResponse.setEmail(usuario.getEmail());
        usuarioResponse.setTelefone(usuario.getTelefone());
        usuarioResponse.setDataCadastro(usuario.getDataCadastro());
        usuarioResponse.setAtivo(usuario.isAtivo());
        usuarioResponse.setRole(usuario.getRole());

        return usuarioResponse;
    }

    public void alterarSenhaEmail(String email, AlterarSenhaRequest request) {

        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(()->new UserNotFoundException("Usuario Não Encontrado."));

        if (!passwordEncoder.matches(request.getSenhaAtual(), usuario.getSenha())) {
            throw new RuntimeException("Senha atual incorreta.");
        }

        usuario.setSenha(passwordEncoder.encode(request.getNovaSenha()));

        usuarioRepository.save(usuario);
    }

    public void excluirCadastro(String email){
        Usuario user = usuarioRepository.findByEmail(email).orElseThrow(()->new UserNotFoundException("Usuario: "+ email +" não Encontrado."));
        usuarioRepository.delete(user);
    }

    public UsuarioResponse me(String email){
        Usuario banco = usuarioRepository.findByEmail(email).orElseThrow(()->new UserNotFoundException("Usuario: "+ email +" não Encontrado."));
        UsuarioResponse usuarioResponse = new UsuarioResponse();
        usuarioResponse.setId(banco.getId());
        usuarioResponse.setNome(banco.getNome());
        usuarioResponse.setEmail(banco.getEmail());
        usuarioResponse.setTelefone(banco.getTelefone());
        usuarioResponse.setDataCadastro(banco.getDataCadastro());
        usuarioResponse.setAtivo(banco.isAtivo());
        usuarioResponse.setRole(banco.getRole());
        return usuarioResponse;
    }
}
