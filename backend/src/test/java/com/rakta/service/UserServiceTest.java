package com.rakta.service;

import com.rakta.dto.AuthDto;
import com.rakta.entity.User;
import com.rakta.repository.UserRepository;
import com.rakta.repository.VerificationTokenRepository;
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

import java.time.LocalDate;
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
    @Mock
    private EmailService emailService;
    @Mock
    private VerificationTokenRepository tokenRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        // Setup done via @InjectMocks
    }

    @Test
    void register_NewUser_ReturnsTokenImmediately() {
        // Given - Updated to use new DTO fields
        AuthDto.RegisterRequest request = new AuthDto.RegisterRequest();
        request.setFirstName("Test");
        request.setLastName("User");
        request.setEmail("test@example.com");
        request.setPassword("password123");
        request.setPhone("+66123456789");
        request.setDateOfBirth(LocalDate.of(1995, 1, 1));
        request.setGender("MALE");
        request.setCity("Bangkok");
        request.setTermsAccepted(true);

        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenAnswer(i -> {
            User u = i.getArgument(0);
            u.setId(1L);
            return u;
        });

        // Mock authentication for immediate token generation
        Authentication mockAuth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuth);
        when(jwtTokenProvider.generateToken(mockAuth)).thenReturn("mock_jwt_token");

        // When
        AuthDto.AuthResponse result = userService.register(request);

        // Then - Users now get token immediately (no email verification)
        assertNotNull(result.getToken());
        assertEquals("mock_jwt_token", result.getToken());
        assertEquals("Test", result.getFirstName());
        assertEquals("User", result.getLastName());
        assertEquals("test@example.com", result.getEmail());

        // Verify NO verification email is sent (email verification removed)
        verify(emailService, never()).sendPasswordResetEmail(anyString(), anyString());
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
                        .firstName("Test")
                        .lastName("User")
                        .email("test@example.com")
                        .enabled(true)
                        .termsAccepted(true)
                        .build()));

        // When
        AuthDto.AuthResponse result = userService.login(request);

        // Then
        assertEquals("mock_jwt_token", result.getToken());
        assertEquals("Test", result.getFirstName());
        assertEquals("User", result.getLastName());
    }
}
