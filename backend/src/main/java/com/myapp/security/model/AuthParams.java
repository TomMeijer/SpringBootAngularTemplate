package com.myapp.security.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class AuthParams {
    private final String email;
    private final String password;
}
