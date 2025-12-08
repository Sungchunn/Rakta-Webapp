package com.rakta.service;

import com.rakta.dto.AuthDto;
import com.rakta.entity.User;
import com.rakta.repository.UserRepository;
import com.rakta.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        // Setup done via @InjectMocks
    }

    @Test
    void register_NewUser_Success() {
        // Given
        AuthDto.RegisterRequest request = new AuthDto.RegisterRequest();
        request.setName("Test User");
        request.setEmail("test@example.com");
        request.setPassword("password123");
        request.setAge(25);
        request.setGender("MALE");

        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenAnswer(i -> {
            User u = i.getArgument(0);
            u.setId(1L);
            return u;
        });

        Authentication mockAuth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuth);
        when(jwtTokenProvider.generateToken(mockAuth)).thenReturn("mock_jwt_token");
        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(User.builder()
                        .id(1L)
                        .name("Test User")
                        .email("test@example.com")
                        .build()));

        // When
        AuthDto.AuthResponse result = userService.register(request);

        // Then
        assertNotNull(result.getToken());
        assertEquals("Test User", result.getName());
        assertEquals("test@example.com", result.getEmail());
    }

    @Test
    void register_ExistingEmail_ThrowsException() {
        // Given
        AuthDto.RegisterRequest request = new AuthDto.RegisterRequest();
        request.setEmail("existing@example.com");

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // When/Then
        assertThrows(RuntimeException.class, () -> userService.register(request));
    }

    @Test
    void login_ValidCredentials_ReturnsToken() {
        // Given
        AuthDto.LoginRequest request = new AuthDto.LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");

        Authentication mockAuth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuth);
        when(jwtTokenProvider.generateToken(mockAuth)).thenReturn("mock_jwt_token");
        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(User.builder()
                        .id(1L)
                        .name("Test User")
                        .email("test@example.com")
                        .build()));

        // When
        AuthDto.AuthResponse result = userService.login(request);

        // Then
        assertEquals("mock_jwt_token", result.getToken());
        assertEquals("Test User", result.getName());
    }
}
