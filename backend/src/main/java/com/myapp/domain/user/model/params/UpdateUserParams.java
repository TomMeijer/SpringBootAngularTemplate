package com.myapp.domain.user.model.params;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@Getter
public class UpdateUserParams {
    private final int id;
    private final String firstName;
    private final String lastName;
    private final MultipartFile profilePic;
}
