package com.archive_enseignant.archive.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegistrationRequest {
    private String username;
    private String password;
    private String email; // Ensure this field is included
}
