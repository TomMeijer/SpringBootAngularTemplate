package com.myapp.security;

import com.myapp.security.model.AuthParams;
import com.myapp.security.model.AuthRequest;
import com.myapp.security.model.TokenDto;
import com.myapp.security.model.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public TokenDto authenticate(@RequestBody @Valid AuthRequest request) {
        return authService.authenticate(new AuthParams(request.getEmail(), request.getPassword()));
    }

    @PostMapping("/refresh-token")
    public TokenDto refreshToken(@AuthenticationPrincipal UserPrincipal principal) {
        return authService.refreshToken(principal);
    }
}
