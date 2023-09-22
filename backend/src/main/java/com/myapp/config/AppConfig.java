package com.myapp.config;

import com.tommeijer.javalib.security.JwtService;
import com.tommeijer.javalib.security.TokenService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AppConfig {
    private final String tokenSecret;
    private final long tokenExpiration;

    public AppConfig(@Value("${app.config.jwt.secret}") String tokenSecret,
                     @Value("${app.config.jwt.expiration-millis}") long tokenExpiration) {
        this.tokenSecret = tokenSecret;
        this.tokenExpiration = tokenExpiration;
    }

    @Bean
    public TokenService tokenService() {
        return new JwtService(tokenSecret, tokenExpiration);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
