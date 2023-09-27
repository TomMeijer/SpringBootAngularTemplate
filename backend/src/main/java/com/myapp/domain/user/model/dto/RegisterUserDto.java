package com.myapp.domain.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RegisterUserDto {
    private final String accessToken;
    private final String refreshToken;
}
