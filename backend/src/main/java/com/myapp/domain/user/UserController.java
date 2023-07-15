package com.myapp.domain.user;

import com.myapp.domain.user.model.dto.RegisterUserDto;
import com.myapp.domain.user.model.dto.UserDto;
import com.myapp.domain.user.model.params.RegisterUserParams;
import com.myapp.domain.user.model.params.UpdateUserParams;
import com.myapp.domain.user.model.request.RegisterUserRequest;
import com.myapp.domain.user.model.request.UpdateUserRequest;
import com.myapp.security.model.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping
    public RegisterUserDto register(@RequestBody @Valid RegisterUserRequest request) {
        return userService.register(new RegisterUserParams(request.getEmail(), request.getPassword()));
    }

    @GetMapping
    public UserDto get(@AuthenticationPrincipal UserPrincipal principal) {
        return userService.get(principal.getUser().getId());
    }

    @PutMapping
    public void update(@AuthenticationPrincipal UserPrincipal principal, @Valid UpdateUserRequest request) {
        userService.update(new UpdateUserParams(
                principal.getUser().getId(),
                request.getFirstName(),
                request.getLastName()
        ));
    }

    @DeleteMapping
    public void delete(@AuthenticationPrincipal UserPrincipal principal) {
        userService.delete(principal.getUser().getId());
    }
}
