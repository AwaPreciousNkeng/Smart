package com.codewithpcodes.smart.auth;

import com.codewithpcodes.smart.config.JwtService;
import com.codewithpcodes.smart.exception.DuplicateResourceException;
import com.codewithpcodes.smart.exception.ResourceNotFoundException;
import com.codewithpcodes.smart.exception.UnauthorizedException;
import com.codewithpcodes.smart.token.Token;
import com.codewithpcodes.smart.token.TokenRepository;
import com.codewithpcodes.smart.token.TokenType;
import com.codewithpcodes.smart.user.Role;
import com.codewithpcodes.smart.user.User;
import com.codewithpcodes.smart.user.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    private static final int MAX_ATTEMPTS = 5;
    private static final int LOCK_DURATION = 15;

    public void Register(RegisterRequest request) {
        String defaultProfilePicture = "https://ui-avatars.com/api?name=" +
                URLEncoder.encode(request.firstName() + " " + request.lastName(), StandardCharsets.UTF_8) +
                "&background=random&color=fff&size=256";

        if (userRepository.existsByEmail(request.email())) {
            log.error("User already exists with email: {}", request.email());
            throw new DuplicateResourceException("User already exists.");
        }

        User user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .profilePicturePath(defaultProfilePicture)
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);
        log.info("User successfully registered: {}", savedUser);
    }


    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid Credentials!"));

        checkLockOut(user);
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.email(),
                            request.password()
                    )
            );
            log.info("Authentication successful!");
        } catch (Exception e) {
            handleFailedAttempts(user);
            int remainingAttempts = MAX_ATTEMPTS - user.getFailedLoginAttempts();

            if (remainingAttempts <= 0) {
                throw new UnauthorizedException("Account locked due to too many failed attempts. " +
                        "Try again in " + LOCK_DURATION + " minutes."
                );
            }
            log.error("Authentication failed: {}", e.getMessage());
            throw new UnauthorizedException(
                    "Invalid Credentials. " +
                            remainingAttempts + " attempt(s) remaining."
            );
        }

        resetFailedAttempts(user);
        var accessToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        revokeAllUserTokens(user);
        saveUserToken(user, accessToken);

        log.info("User {} logged in successfully", user.getEmail());
        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .fullName(user.getFullName())
                .build();
    }

    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) return;
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);

        if (userEmail != null) {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found."));

            if (jwtService.isTokenValid(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user);
                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);

                AuthenticationResponse authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .userId(user.getId())
                        .fullName(user.getFullName())
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }

    public AuthenticationResponse createUser(CreateUserRequest request) {
        String defaultProfilePicture = "https://ui-avatars.com/api?name=" +
                URLEncoder.encode(request.firstName() + " " + request.lastName(), StandardCharsets.UTF_8) +
                "&background=random&color=fff&size=256";

        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("User already exists");
        }

        log.info("Creating new user: {}", request.email());
        User user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .profilePicturePath(defaultProfilePicture)
                .role(request.role())
                .createdAt(LocalDateTime.now())
                .build();

        log.info("User successfully created: {}", user);
        User savedUser = userRepository.save(user);
        log.info("User successfully saved: {}", savedUser);
        String accessToken  = jwtService.generateToken(savedUser);
        String refreshToken = jwtService.generateRefreshToken(savedUser);
        log.info("User successfully refreshed: {}", accessToken);
        saveUserToken(savedUser, accessToken);
        log.info("User successfully refreshed: {}", refreshToken);
        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(savedUser.getId())
                .fullName(savedUser.getFullName())
                .build();
    }

    public AuthenticationResponse createAdmin(CreateAdminRequest request) {
        String defaultProfilePicture = "https://ui-avatars.com/api?name=" +
                URLEncoder.encode(request.firstName() + " " + request.lastName(), StandardCharsets.UTF_8) +
                "&background=random&color=fff&size=256";

        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("User already exists");
        }

        User admin = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .profilePicturePath(defaultProfilePicture)
                .role(Role.ADMIN)
                .createdAt(LocalDateTime.now())
                .build();

        User savedAdmin = userRepository.save(admin);

        String accessToken = jwtService.generateToken(savedAdmin);
        String refreshToken = jwtService.generateRefreshToken(savedAdmin);

        saveUserToken(savedAdmin, accessToken);
        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(savedAdmin.getId())
                .fullName(savedAdmin.getFullName())
                .build();
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty()) return;
        validUserTokens.forEach(token -> {
            token.setRevoked(true);
            token.setExpired(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    private void saveUserToken(User user, String accessToken) {
        Token token = Token.builder()
                .user(user)
                .token(accessToken)
                .type(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void checkLockOut(User user) {
        if (!user.isAccountLocked()) return;

        if (user.getLockedUntil() != null && LocalDateTime.now().isAfter(user.getLockedUntil())) {
            resetFailedAttempts(user);
            return;
        }

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("HH:mm:ss");
        String unlockTime = user.getLockedUntil() != null ? user.getLockedUntil().format(fmt) : "Soon";
        throw new UnauthorizedException("Account Locked due to too many failed attempts. " +
                "Try again after " + unlockTime);
    }

    private void handleFailedAttempts(User user) {
        int attempts = user.getFailedLoginAttempts() + 1;
        user.setFailedLoginAttempts(attempts);
        if (attempts >= MAX_ATTEMPTS) {
            user.setAccountLocked(true);
            user.setLockedUntil(LocalDateTime.now().plusMinutes(LOCK_DURATION));
        }
        userRepository.save(user);
    }

    private void resetFailedAttempts(User user) {
        user.setFailedLoginAttempts(0);
        user.setAccountLocked(false);
        user.setLockedUntil(null);
        userRepository.save(user);
    }
}
