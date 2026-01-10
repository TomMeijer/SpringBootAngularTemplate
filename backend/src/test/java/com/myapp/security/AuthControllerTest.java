package com.myapp.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.myapp.security.model.AuthRequest;
import com.myapp.security.model.RefreshAccessTokenRequest;
import com.tommeijer.javalib.security.AuthService;
import com.tommeijer.javalib.security.model.AuthenticatedDto;
import com.tommeijer.javalib.security.model.RefreshAccessTokenDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.when;
import static org.mockito.hamcrest.MockitoHamcrest.argThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }

    @Test
    void authenticate_ValidRequest_ReturnsAuthenticatedDto() throws Exception {
        AuthRequest request = new AuthRequest();
        request.setEmail("test@example.com");
        request.setPassword("password");

        AuthenticatedDto responseDto = new AuthenticatedDto("accessToken", "refreshToken");
        when(authService.authenticate(argThat(allOf(
                hasProperty("email", is(request.getEmail())),
                hasProperty("password", is(request.getPassword()))
        )))).thenReturn(responseDto);

        mockMvc.perform(post("/auth")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("accessToken"))
                .andExpect(jsonPath("$.refreshToken").value("refreshToken"));
    }

    @Test
    void refreshAccessToken_ValidRequest_ReturnsRefreshAccessTokenDto() throws Exception {
        RefreshAccessTokenRequest request = new RefreshAccessTokenRequest();
        request.setRefreshToken("refreshToken");

        RefreshAccessTokenDto responseDto = new RefreshAccessTokenDto("newAccessToken", "newRefreshToken");
        when(authService.refreshAccessToken("refreshToken")).thenReturn(responseDto);

        mockMvc.perform(post("/auth/refresh-access-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("newAccessToken"))
                .andExpect(jsonPath("$.refreshToken").value("newRefreshToken"));
    }
}
