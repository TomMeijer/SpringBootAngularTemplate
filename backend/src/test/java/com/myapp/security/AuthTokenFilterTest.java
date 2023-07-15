package com.myapp.security;

import com.myapp.domain.user.entity.User;
import com.myapp.security.model.UserPrincipal;
import io.jsonwebtoken.impl.DefaultClaims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthTokenFilterTest {
    @Mock
    private JwtService jwtService;
    @Mock
    private UserDetailsService userService;
    @Mock
    private FilterChain filterChain;

    private AuthTokenFilter tokenFilter;

    @BeforeEach
    void setUp() {
        tokenFilter = new AuthTokenFilter(jwtService, userService);
        SecurityContextHolder.createEmptyContext();
    }

    @AfterEach
    public void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void doFilterInternal_validToken_setAuth() throws ServletException, IOException {
        var token = "token";
        var request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer " + token);

        var username = "user1";
        var claims = new DefaultClaims();
        claims.setSubject(username);
        when(jwtService.validate(token)).thenReturn(claims);

        var principal = new UserPrincipal(new User());
        when(userService.loadUserByUsername(username)).thenReturn(principal);

        var response = new MockHttpServletResponse();
        tokenFilter.doFilterInternal(request, response, filterChain);

        var auth = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        assertTrue(auth.isAuthenticated());
        assertEquals(principal, auth.getPrincipal());
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void doFilterInternal_noToken_noAuth() throws ServletException, IOException {
        var request = new MockHttpServletRequest();
        var response = new MockHttpServletResponse();
        tokenFilter.doFilterInternal(request, response, filterChain);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(filterChain).doFilter(request, response);
    }
}
