package com.crm.auth.service;

import com.crm.auth.dto.*;
import com.crm.auth.model.*;
import com.crm.auth.repository.*;
import com.crm.auth.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent())
            throw new RuntimeException("Username already exists: " + request.getUsername());
        if (userRepository.findByEmail(request.getEmail()).isPresent())
            throw new RuntimeException("Email already registered: " + request.getEmail());

        String roleName = (request.getRole() != null) ? request.getRole().toUpperCase() : "EMPLOYEE";
        Role role = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.findByName("EMPLOYEE").orElseThrow());

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .role(role)
                .isActive(1)
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user.getUsername(),
                Map.of("role", role.getName(), "userId", user.getId(), "email", user.getEmail()));

        return AuthResponse.builder()
                .token(token).tokenType("Bearer")
                .username(user.getUsername()).email(user.getEmail())
                .role(role.getName()).userId(user.getId())
                .firstName(user.getFirstName()).lastName(user.getLastName())
                .message("Registration successful")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user.getUsername(),
                Map.of("role", user.getRole().getName(), "userId", user.getId(), "email", user.getEmail()));

        return AuthResponse.builder()
                .token(token).tokenType("Bearer")
                .username(user.getUsername()).email(user.getEmail())
                .role(user.getRole().getName()).userId(user.getId())
                .firstName(user.getFirstName()).lastName(user.getLastName())
                .message("Login successful")
                .build();
    }

    public boolean validateToken(String token) {
        return jwtService.isTokenValid(token);
    }
}
