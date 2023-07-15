package com.myapp.domain.user.model.params;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UpdateUserParams {
    private final int id;
    private final String firstName;
    private final String lastName;
}
