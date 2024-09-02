package com.archive_enseignant.archive.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordResetRequest {
    private String email;
    private String token;
    private String newPassword;
}


