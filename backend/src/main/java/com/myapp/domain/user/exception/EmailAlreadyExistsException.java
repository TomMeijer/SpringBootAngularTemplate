package com.myapp.domain.user.exception;

public class EmailAlreadyExistsException extends RuntimeException {

    public EmailAlreadyExistsException(String email) {
        super("A user with email address '%s' already exists".formatted(email));
    }
}
