package com.myapp.security;

import com.tommeijer.javalib.security.AuthService;
import com.tommeijer.javalib.security.JwtService;
import com.tommeijer.javalib.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {
    private final String accessTokenSecret;
    private final String refreshTokenSecret;
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;

    public SecurityConfig(@Value("${app.config.jwt.access-token-secret}") String accessTokenSecret,
                          @Value("${app.config.jwt.refresh-token-secret}") String refreshTokenSecret,
                          @Value("${app.config.jwt.access-token-expiration}") long accessTokenExpiration,
                          @Value("${app.config.jwt.refresh-token-expiration}") long refreshTokenExpiration) {
        this.accessTokenSecret = accessTokenSecret;
        this.refreshTokenSecret = refreshTokenSecret;
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    @Bean
    public TokenService accessTokenService() {
        return new JwtService(accessTokenSecret, accessTokenExpiration);
    }

    @Bean
    public TokenService refreshTokenService() {
        return new JwtService(refreshTokenSecret, refreshTokenExpiration);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Autowired
    public AuthService authService(AuthenticationManager authenticationManager,
                                   TokenService accessTokenService,
                                   TokenService refreshTokenService) {
        return new AuthService(authenticationManager, accessTokenService, refreshTokenService);
    }
}
