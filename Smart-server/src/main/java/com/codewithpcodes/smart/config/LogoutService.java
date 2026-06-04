package com.codewithpcodes.smart.config;

import com.codewithpcodes.smart.token.Token;
import com.codewithpcodes.smart.token.TokenRepository;
import jakarta.annotation.Nonnull;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {

    private final TokenRepository tokenRepository;

    @Override
    public void logout(
            @Nonnull HttpServletRequest request,
            @Nonnull HttpServletResponse response,
            @Nullable Authentication authentication
    ) {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        if (authHeader == null && !authHeader.startsWith("Bearer ")) {
            return;
        }
        jwt = authHeader.substring(7);
        Optional<Token> storedToken = tokenRepository.findByToken(jwt);
        if (storedToken.isPresent()) {
            Token token = storedToken.get();
            token.setRevoked(true);
            token.setExpired(true);
            tokenRepository.save(token);
            SecurityContextHolder.clearContext();
        }
    }
}
