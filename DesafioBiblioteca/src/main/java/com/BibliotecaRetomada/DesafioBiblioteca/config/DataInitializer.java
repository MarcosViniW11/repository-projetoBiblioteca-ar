package com.BibliotecaRetomada.DesafioBiblioteca.config;

import com.BibliotecaRetomada.DesafioBiblioteca.model.Role;
import com.BibliotecaRetomada.DesafioBiblioteca.model.Usuario;
import com.BibliotecaRetomada.DesafioBiblioteca.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception{
        String adminEmail = "admin@admin.com";

        if(userRepository.findByEmail(adminEmail).isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNome("Admin");
            admin.setEmail(adminEmail);
            admin.setSenha(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ROLE_ADMIN);
            userRepository.save(admin);
            System.out.println("---------- ADMINISTRADOR INICIAL CRIADO ----------");
            System.out.println("Email: admin@admin.com | Senha: admin123");
            System.out.println("--------------------------------------------------");
        }
    }

}
