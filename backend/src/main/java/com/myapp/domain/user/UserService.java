package com.myapp.domain.user;

import com.myapp.domain.user.entity.File;
import com.myapp.domain.user.entity.User;
import com.myapp.domain.user.exception.EmailAlreadyExistsException;
import com.myapp.domain.user.exception.ProfilePicReadException;
import com.myapp.domain.user.model.dto.RegisterUserDto;
import com.myapp.domain.user.model.dto.UserDto;
import com.myapp.domain.user.model.params.RegisterUserParams;
import com.myapp.domain.user.model.params.UpdateUserParams;
import com.tommeijer.javalib.security.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService accessTokenService;
    private final TokenService refreshTokenService;

    @Transactional
    public RegisterUserDto register(RegisterUserParams params) {
        Optional<User> optionalUser = userRepository.findByEmail(params.getEmail());
        if (optionalUser.isPresent()) {
            throw new EmailAlreadyExistsException(params.getEmail());
        }
        var user = new User();
        user.setFirstName(params.getFirstName());
        user.setLastName(params.getLastName());
        user.setEmail(params.getEmail());
        user.setPassword(passwordEncoder.encode(params.getPassword()));
        user = userRepository.save(user);

        String accessToken = accessTokenService.create(user.getEmail());
        String refreshToken = refreshTokenService.create(user.getEmail());
        return new RegisterUserDto(accessToken, refreshToken);
    }

    public UserDto get(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return new UserDto(user);
    }

    @Transactional
    public void update(UpdateUserParams params) {
        User user = userRepository.findById(params.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setFirstName(params.getFirstName());
        user.setLastName(params.getLastName());
        user.setProfilePic(params.getProfilePic() != null ? createProfilePicFile(user, params.getProfilePic()) : null);
        userRepository.save(user);
    }

    private File createProfilePicFile(User user, MultipartFile profilePic) {
        try {
            return new File(
                    user.getProfilePic() != null ? user.getProfilePic().getId() : null,
                    profilePic.getBytes(),
                    profilePic.getContentType(),
                    profilePic.getOriginalFilename()
            );
        } catch (IOException e) {
            throw new ProfilePicReadException(e);
        }
    }

    public void delete(int id) {
        userRepository.deleteById(id);
    }
}
