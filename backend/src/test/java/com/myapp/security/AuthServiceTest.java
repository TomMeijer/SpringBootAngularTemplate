package com.myapp.security;

import com.myapp.domain.user.entity.User;
import com.myapp.security.model.AuthParams;
import com.myapp.security.model.UserPrincipal;
import com.tommeijer.javalib.security.TokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private TokenService tokenService;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(authenticationManager, tokenService);
    }

    @Test
    void authenticate_user_generateToken() {
        var params = new AuthParams("email", "password");
        var user = new User("username");
        var auth = new TestingAuthenticationToken(new UserPrincipal(user), null);
        when(authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(params.getEmail(), params.getPassword())))
                .thenReturn(auth);
        var token = "token";
        when(tokenService.create(user.getEmail())).thenReturn(token);
        var result = authService.authenticate(params);
        assertEquals(token, result.getToken());
    }

    @Test
    void refreshToken_forPrincipal_returnToken() {
        var user = new User("email");
        var principal = new UserPrincipal(user);
        var token = "token";
        when(tokenService.create(user.getEmail())).thenReturn(token);
        var result = authService.refreshToken(principal);
        assertEquals(token, result.getToken());
    }
}
