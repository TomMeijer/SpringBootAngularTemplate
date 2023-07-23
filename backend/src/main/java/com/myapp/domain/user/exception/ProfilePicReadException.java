package com.myapp.domain.user.exception;

public class ProfilePicReadException extends RuntimeException {
    public ProfilePicReadException(Throwable cause) {
        super("Error reading contents of profile pic", cause);
    }
}
