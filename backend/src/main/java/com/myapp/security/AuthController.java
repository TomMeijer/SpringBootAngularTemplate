package com.myapp.security;

import com.myapp.security.model.*;
import com.tommeijer.javalib.security.AuthService;
import com.tommeijer.javalib.security.model.AccessTokenDto;
import com.tommeijer.javalib.security.model.AuthParams;
import com.tommeijer.javalib.security.model.AuthenticatedDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping
    public AuthenticatedDto authenticate(@RequestBody @Valid AuthRequest request) {
        return authService.authenticate(new AuthParams(request.getEmail(), request.getPassword()));
    }

    @PostMapping("/refresh-access-token")
    public AccessTokenDto refreshAccessToken(@RequestBody @Valid RefreshAccessTokenRequest request) {
        return authService.refreshAccessToken(request.getRefreshToken());
    }
}
