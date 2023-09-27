package com.myapp.security.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RefreshAccessTokenRequest {
    @NotBlank
    private String refreshToken;
}
