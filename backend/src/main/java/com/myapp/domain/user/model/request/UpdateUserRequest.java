package com.myapp.domain.user.model.request;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class UpdateUserRequest {
    private String firstName;
    private String lastName;
    private MultipartFile profilePic;
}
