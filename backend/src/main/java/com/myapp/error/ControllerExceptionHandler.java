package com.myapp.error;

import com.myapp.domain.user.exception.EmailAlreadyExistsException;
import com.myapp.domain.user.exception.ProfilePicReadException;
import com.tommeijer.javalib.error.logging.ErrorLogger;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
@RequiredArgsConstructor
public class ControllerExceptionHandler {
    private final ErrorLogger errorLogger;

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseStatusException handleEmailAlreadyExistsException(EmailAlreadyExistsException e) {
        errorLogger.log(e.getMessage(), e);
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, "An account with this email address already exists.");
    }

    @ExceptionHandler(ProfilePicReadException.class)
    public ResponseStatusException handleProfilePicReadException(ProfilePicReadException e) {
        errorLogger.log(e.getMessage(), e);
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error reading profile picture.");
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseStatusException handleBadCredentialsException(BadCredentialsException e) {
        errorLogger.log(e.getMessage(), e);
        return new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid username/password combination.");
    }

    @ExceptionHandler(Exception.class)
    public void handleException(Exception e) throws Exception {
        errorLogger.log(e.getMessage(), e);
        throw e;
    }
}
