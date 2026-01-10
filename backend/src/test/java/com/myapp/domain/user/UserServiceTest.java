package com.myapp.domain.user;

import com.myapp.domain.user.entity.User;
import com.myapp.domain.user.exception.EmailAlreadyExistsException;
import com.myapp.domain.user.model.params.RegisterUserParams;
import com.myapp.domain.user.model.params.UpdateUserParams;
import com.tommeijer.javalib.security.TokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;
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
    private TokenService accessTokenService;
    @Mock
    private TokenService refreshTokenService;

    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserService(userRepository, passwordEncoder, accessTokenService, refreshTokenService);
    }

    @Test
    void register_ValidParams_SavesUserAndReturnsDto() {
        var params = new RegisterUserParams("john", "doe", "email", "password");

        var encodedPassword = "ABC123";
        when(passwordEncoder.encode(params.getPassword())).thenReturn(encodedPassword);

        var savedUser = new User();
        savedUser.setEmail("email");
        when(userRepository.save(argThat(allOf(
                hasProperty("firstName", is(params.getFirstName())),
                hasProperty("lastName", is(params.getLastName())),
                hasProperty("email", is(params.getEmail())),
                hasProperty("password", is(encodedPassword))
        )))).thenReturn(savedUser);

        var accessToken = "accessToken";
        when(accessTokenService.create(savedUser.getEmail())).thenReturn(accessToken);
        var refreshToken = "refreshToken";
        when(refreshTokenService.create(savedUser.getEmail())).thenReturn(refreshToken);

        var result = userService.register(params);
        assertThat(result, hasProperty("accessToken", is(accessToken)));
        assertThat(result, hasProperty("refreshToken", is(refreshToken)));
    }

    @Test
    void register_ExistingEmail_ThrowsEmailAlreadyExistsException() {
        var params = new RegisterUserParams("john", "doe", "email", "password");
        when(userRepository.findByEmail(params.getEmail())).thenReturn(Optional.of(new User()));
        assertThrows(
                EmailAlreadyExistsException.class,
                () -> userService.register(params),
                "A user with email address '%s' already exists".formatted(params.getEmail())
        );
    }

    @Test
    void get_ExistingUserId_ReturnsUserDto() {
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
    void update_ValidParams_SavesUser() throws IOException {
        var params = new UpdateUserParams(
                1,
                "john",
                "doe",
                new MockMultipartFile("name", "origName", "image/jpg", new byte[]{})
        );
        var user = new User(params.getId());
        when(userRepository.findById(params.getId())).thenReturn(Optional.of(user));
        userService.update(params);
        verify(userRepository).save(argThat(allOf(
                hasProperty("id", is(params.getId())),
                hasProperty("firstName", is(params.getFirstName())),
                hasProperty("lastName", is(params.getLastName())),
                hasProperty("profilePic", allOf(
                        hasProperty("content", is(params.getProfilePic().getBytes())),
                        hasProperty("type", is(params.getProfilePic().getContentType())),
                        hasProperty("name", is(params.getProfilePic().getOriginalFilename()))
                ))
        )));
    }

    @Test
    void delete_AnyId_CallsUserRepositoryDeleteById() {
        var id = 2;
        userService.delete(id);
        verify(userRepository).deleteById(id);
    }
}
