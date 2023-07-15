package com.myapp.security;

import com.myapp.domain.user.UserRepository;
import com.myapp.domain.user.entity.User;
import com.myapp.security.model.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {
    @Mock
    private UserRepository userRepository;

    private UserDetailsServiceImpl userDetailsService;

    @BeforeEach
    void setUp() {
        userDetailsService = new UserDetailsServiceImpl(userRepository);
    }

    @Test
    void loadUserByUsername_email_returnUser() {
        var email = "email";
        var user = new User();
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        var principal = (UserPrincipal) userDetailsService.loadUserByUsername(email);
        assertEquals(user, principal.getUser());
    }
}
