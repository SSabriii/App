package com.archive_enseignant.archive.controllers;

import com.archive_enseignant.archive.dtos.*;
import com.archive_enseignant.archive.entities.AppUser;
import com.archive_enseignant.archive.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/password-reset-request")
    public ResponseEntity<?> requestPasswordReset(@RequestBody PasswordResetRequest passwordResetRequest) {
        String token = userService.createPasswordResetToken(passwordResetRequest.getEmail());
        if (token == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with that email not found");
        }
        return ResponseEntity.ok(new PasswordResetResponse(token));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest passwordResetRequest) {
        boolean success = userService.resetPassword(passwordResetRequest.getToken(), passwordResetRequest.getNewPassword());
        if (success) {
            return ResponseEntity.ok("Password has been reset successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistrationRequest registrationRequest) {

        AppUser user = userService.registerUser(
                registrationRequest.getUsername(),
                registrationRequest.getPassword(),
                registrationRequest.getEmail()
        );
        if (user == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse("Username or email already exists"));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        Optional<AppUser> user = userService.authenticateUser(
                loginRequest.getUsername(),
                loginRequest.getPassword(),
                loginRequest.getEmail()
        );
        if (user.isPresent()) {

            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Invalid credentials"));
        }
    }
}
