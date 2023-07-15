package com.myapp.domain.user;

import com.myapp.domain.user.entity.User;
import com.myapp.domain.user.model.params.RegisterUserParams;
import com.myapp.domain.user.model.params.UpdateUserParams;
import com.myapp.security.TokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Date;
import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.hamcrest.MockitoHamcrest.argThat;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private TokenService tokenService;

    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserService(userRepository, passwordEncoder, tokenService);
    }

    @Test
    void register_user_save() {
        var params = new RegisterUserParams("email", "password");

        var encodedPassword = "ABC123";
        when(passwordEncoder.encode(params.getPassword())).thenReturn(encodedPassword);

        var savedUser = new User();
        savedUser.setEmail("email");
        when(userRepository.save(argThat(allOf(
                hasProperty("email", is(params.getEmail())),
                hasProperty("password", is(encodedPassword))
        )))).thenReturn(savedUser);

        var token = "token";
        when(tokenService.create(savedUser.getEmail())).thenReturn(token);

        var result = userService.register(params);
        assertThat(result, hasProperty("token", is(token)));
    }

    @Test
    void register_existingEmail_throwException() {
        var params = new RegisterUserParams("email", "password");
        when(userRepository.findByEmail(params.getEmail())).thenReturn(Optional.of(new User()));
        assertThrows(
                IllegalArgumentException.class,
                () -> userService.register(params),
                "An account with this email address already exists"
        );
    }

    @Test
    void get_byId_returnUser() {
        var id = 2;
        var user = new User(id);
        user.setEmail("email");
        user.setFirstName("john");
        user.setLastName("doe");
        user.setCreatedOn(new Date());
        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        var result = userService.get(id);
        assertThat(result, allOf(
                hasProperty("id", is(user.getId())),
                hasProperty("email", is(user.getEmail())),
                hasProperty("firstName", is(user.getFirstName())),
                hasProperty("lastName", is(user.getLastName())),
                hasProperty("createdOn", is(user.getCreatedOn()))
        ));
    }

    @Test
    void update_user_save() {
        var params = new UpdateUserParams(1, "john", "doe");
        var user = new User(params.getId());
        when(userRepository.findById(params.getId())).thenReturn(Optional.of(user));
        userService.update(params);
        verify(userRepository).save(argThat(allOf(
                hasProperty("id", is(params.getId())),
                hasProperty("firstName", is(params.getFirstName())),
                hasProperty("lastName", is(params.getLastName()))
        )));
    }

    @Test
    void delete_byId_delete() {
        var id = 2;
        userService.delete(id);
        verify(userRepository).deleteById(id);
    }
}
