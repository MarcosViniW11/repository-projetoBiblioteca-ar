package com.BibliotecaRetomada.DesafioBiblioteca.security;

import com.BibliotecaRetomada.DesafioBiblioteca.dto.request.LoginRequest;
import com.BibliotecaRetomada.DesafioBiblioteca.dto.request.RegisterRequest;
import com.BibliotecaRetomada.DesafioBiblioteca.dto.response.JwtResponse;
import com.BibliotecaRetomada.DesafioBiblioteca.model.Role;
import com.BibliotecaRetomada.DesafioBiblioteca.model.Usuario;
import com.BibliotecaRetomada.DesafioBiblioteca.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UsuarioRepository usuarioRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    public JwtResponse register(RegisterRequest request) {

        if (usuarioRepository.existsByEmail(request.getEmail())) {

            throw new RuntimeException(
                    "E-mail já cadastrado."
            );
        }

        Usuario usuario = new Usuario();

        usuario.setNome(request.getNome());

        usuario.setEmail(request.getEmail());

        usuario.setTelefone(request.getTelefone());

        usuario.setSenha(
                passwordEncoder.encode(request.getSenha())
        );

        usuario.setRole(Role.ROLE_USER);

        usuario.setAtivo(true);

        usuarioRepository.save(usuario);

        String token = jwtService.generateToken(usuario);

        return new JwtResponse(token,usuario.getRole());

    }

    public JwtResponse login(LoginRequest request) {

        Usuario usuario = usuarioRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado."));

        authenticationManager.authenticate(

                new UsernamePasswordAuthenticationToken(

                        request.getEmail(),

                        request.getSenha()

                )

        );

        String token = jwtService.generateToken(usuario);

        return new JwtResponse(token,usuario.getRole());

    }

}
