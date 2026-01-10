package com.myapp.domain.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.myapp.domain.user.entity.User;
import com.myapp.domain.user.model.dto.RegisterUserDto;
import com.myapp.domain.user.model.dto.UserDto;
import com.myapp.domain.user.model.request.RegisterUserRequest;
import com.myapp.security.model.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.Date;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.when;
import static org.mockito.hamcrest.MockitoHamcrest.argThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final HandlerMethodArgumentResolver authenticationPrincipalResolver = new HandlerMethodArgumentResolver() {
        @Override
        public boolean supportsParameter(MethodParameter parameter) {
            return parameter.hasParameterAnnotation(AuthenticationPrincipal.class);
        }
        @Override
        public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
            return principal;
        }
    };

    private UserPrincipal principal;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(userController)
                .setCustomArgumentResolvers(authenticationPrincipalResolver)
                .build();
    }

    @Test
    void register_ValidRequest_ReturnsRegisterUserDto() throws Exception {
        RegisterUserRequest request = new RegisterUserRequest();
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setEmail("john.doe@example.com");
        request.setPassword("password123");

        RegisterUserDto responseDto = new RegisterUserDto("accessToken", "refreshToken");
        when(userService.register(argThat(allOf(
                hasProperty("firstName", is(request.getFirstName())),
                hasProperty("lastName", is(request.getLastName())),
                hasProperty("email", is(request.getEmail())),
                hasProperty("password", is(request.getPassword()))
        )))).thenReturn(responseDto);

        mockMvc.perform(post("/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("accessToken"))
                .andExpect(jsonPath("$.refreshToken").value("refreshToken"));
    }

    @Test
    void get_ValidPrincipal_ReturnsUserDto() throws Exception {
        int userId = 1;
        User user = new User(userId);
        user.setEmail("john.doe@example.com");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setCreatedOn(new Date());
        this.principal = new UserPrincipal(user);

        UserDto userDto = new UserDto(user);

        when(userService.get(userId)).thenReturn(userDto);

        mockMvc.perform(get("/user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(userId))
                .andExpect(jsonPath("$.email").value("john.doe@example.com"))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"));
    }

    @Test
    void update_ValidRequest_CallsUserServiceUpdate() throws Exception {
        int userId = 1;
        User user = new User(userId);
        this.principal = new UserPrincipal(user);

        MockMultipartFile profilePic = new MockMultipartFile("profilePic", "test.jpg", "image/jpeg", "some-image".getBytes());

        mockMvc.perform(multipart("/user")
                        .file(profilePic)
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        })
                        .param("firstName", "Jane")
                        .param("lastName", "Smith"))
                .andExpect(status().isOk());
    }

    @Test
    void delete_ValidPrincipal_CallsUserServiceDelete() throws Exception {
        int userId = 1;
        User user = new User(userId);
        this.principal = new UserPrincipal(user);

        mockMvc.perform(delete("/user"))
                .andExpect(status().isOk());
    }
}
