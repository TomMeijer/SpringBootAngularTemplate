package com.myapp.domain.user.model.params;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class RegisterUserParams {
    private final String firstName;
    private final String lastName;
    private final String email;
    private final String password;
}
