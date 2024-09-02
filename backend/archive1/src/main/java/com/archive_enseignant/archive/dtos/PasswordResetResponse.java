package com.archive_enseignant.archive.dtos;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class PasswordResetResponse {
    private String token;

    public PasswordResetResponse(String token) {
        this.token = token;
    }
}