package com.myapp.domain.user.model.dto;

import com.myapp.domain.user.entity.File;
import com.myapp.domain.user.entity.User;
import lombok.Getter;

import java.util.Date;

@Getter
public class UserDto {
    private final int id;
    private final String email;
    private final String firstName;
    private final String lastName;
    private final File profilePic;
    private final Date createdOn;

    public UserDto(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.profilePic = user.getProfilePic();
        this.createdOn = user.getCreatedOn();
    }
}
