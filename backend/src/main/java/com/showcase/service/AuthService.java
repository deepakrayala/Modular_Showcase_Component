package com.showcase.service;

import com.showcase.dto.AuthResponse;
import com.showcase.dto.LoginRequest;
import com.showcase.dto.SignupRequest;
import com.showcase.dto.UserListResponse;
import com.showcase.model.Role;
import com.showcase.model.User;
import com.showcase.repository.RoleRepository;
import com.showcase.repository.UserRepository;
import com.showcase.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse signup(SignupRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        Integer roleId = request.getRoleId() != null ? request.getRoleId() : 1;
        Role userRole = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        // Hash password with BCrypt
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getName().trim(), email, hashedPassword, userRole);
        user = userRepository.save(user);

        // Generate JWT
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().getName());

        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                user.getId(), user.getName(), user.getEmail(),
                user.getRole().getId(), user.getRole().getName()
        );

        return new AuthResponse("Account created successfully", token, userInfo);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        // BCrypt comparison
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        // Generate JWT
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().getName());

        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                user.getId(), user.getName(), user.getEmail(),
                user.getRole().getId(), user.getRole().getName()
        );

        return new AuthResponse("Login successful", token, userInfo);
    }

    public List<UserListResponse.UserItem> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(user -> new UserListResponse.UserItem(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().getId(),
                user.getRole().getName(),
                user.getCreatedAt()
        )).collect(Collectors.toList());
    }

    public void deleteUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        userRepository.delete(user);
    }
}
