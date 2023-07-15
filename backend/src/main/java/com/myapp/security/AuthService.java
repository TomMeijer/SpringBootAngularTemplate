package com.myapp.security;

import com.myapp.security.model.AuthParams;
import com.myapp.security.model.TokenDto;
import com.myapp.security.model.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public TokenDto authenticate(AuthParams params) {
        Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                params.getEmail(),
                params.getPassword()
        ));
        var principal = (UserPrincipal) auth.getPrincipal();
        String token = tokenService.create(principal.getUsername());
        return new TokenDto(token);
    }

    public TokenDto refreshToken(UserPrincipal principal) {
        String token = tokenService.create(principal.getUsername());
        return new TokenDto(token);
    }
}
