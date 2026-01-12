package com.myapp.error;

import com.myapp.domain.user.exception.EmailAlreadyExistsException;
import com.myapp.domain.user.exception.ProfilePicReadException;
import com.tommeijer.javalib.error.logging.ErrorLogger;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ControllerExceptionHandlerTest {

    private MockMvc mockMvc;

    @Mock
    private ErrorLogger errorLogger;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new TestController())
                .setControllerAdvice(new ControllerExceptionHandler(errorLogger))
                .build();
    }

    @Test
    void handleEmailAlreadyExistsException_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/test/email-exists"))
                .andExpect(status().isBadRequest());

        verify(errorLogger).log(eq("A user with email address 'test@example.com' already exists"), any(EmailAlreadyExistsException.class));
    }

    @Test
    void handleProfilePicReadException_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/test/profile-pic-error"))
                .andExpect(status().isBadRequest());

        verify(errorLogger).log(eq("Error reading contents of profile pic"), any(ProfilePicReadException.class));
    }

    @Test
    void handleBadCredentialsException_ShouldReturnForbidden() throws Exception {
        mockMvc.perform(get("/test/bad-credentials"))
                .andExpect(status().isForbidden());

        verify(errorLogger).log(eq("Bad credentials"), any(BadCredentialsException.class));
    }

    @Test
    void handleJwtException_ShouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/test/jwt-error"))
                .andExpect(status().isUnauthorized());

        verify(errorLogger).log(eq("JWT error"), any(JwtException.class));
    }

    @Test
    void handleException_ShouldRethrowAndLog() {
        try {
            mockMvc.perform(get("/test/generic-exception"));
        } catch (Exception e) {
            // Expected
        }

        verify(errorLogger).log(eq("Generic error"), any(RuntimeException.class));
    }

    @RestController
    static class TestController {

        @GetMapping("/test/email-exists")
        public void throwEmailExists() {
            throw new EmailAlreadyExistsException("test@example.com");
        }

        @GetMapping("/test/profile-pic-error")
        public void throwProfilePicError() {
            throw new ProfilePicReadException(new RuntimeException("cause"));
        }

        @GetMapping("/test/bad-credentials")
        public void throwBadCredentials() {
            throw new BadCredentialsException("Bad credentials");
        }

        @GetMapping("/test/jwt-error")
        public void throwJwtError() {
            throw new JwtException("JWT error") {};
        }

        @GetMapping("/test/generic-exception")
        public void throwGenericException() {
            throw new RuntimeException("Generic error");
        }
    }
}
