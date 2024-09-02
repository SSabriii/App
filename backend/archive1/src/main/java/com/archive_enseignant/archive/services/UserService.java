package com.archive_enseignant.archive.services;

import com.archive_enseignant.archive.entities.AppUser;
import com.archive_enseignant.archive.entities.PasswordResetToken;
import com.archive_enseignant.archive.repositories.PasswordResetTokenRepository;
import com.archive_enseignant.archive.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository tokenRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, PasswordResetTokenRepository tokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenRepository = tokenRepository;
    }

    public AppUser registerUser(String username, String password, String email) {
        if (userRepository.findByUsername(username).isPresent() || userRepository.findByEmail(email).isPresent()) {
            return null;
        }

        AppUser user = new AppUser();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setRole("USER");

        return userRepository.save(user);
    }

    public Optional<AppUser> authenticateUser(String username, String password, String email) {
        Optional<AppUser> user;

        if (username != null) {
            user = userRepository.findByUsername(username);
        } else if (email != null) {
            user = userRepository.findByEmail(email);
        } else {
            return Optional.empty();
        }

        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            return user;
        }
        return Optional.empty();
    }

    public String createPasswordResetToken(String email) {
        Optional<AppUser> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            return null;
        }

        AppUser appUser = user.get();
        PasswordResetToken token = new PasswordResetToken();
        token.setToken(UUID.randomUUID().toString());
        token.setUser(appUser);
        token.setExpiryDate(LocalDateTime.now().plusHours(1));

        tokenRepository.save(token);



        return token.getToken();
    }

    public boolean validatePasswordResetToken(String token) {
        Optional<PasswordResetToken> resetToken = tokenRepository.findByToken(token);
        if (resetToken.isEmpty()) {
            return false;
        }

        PasswordResetToken tokenEntity = resetToken.get();
        if (tokenEntity.getExpiryDate().isBefore(LocalDateTime.now())) {
            return false;
        }

        return true;
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> resetToken = tokenRepository.findByToken(token);
        if (resetToken.isEmpty()) {
            return false;
        }

        PasswordResetToken tokenEntity = resetToken.get();
        if (tokenEntity.getExpiryDate().isBefore(LocalDateTime.now())) {
            return false;
        }

        AppUser user = tokenEntity.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);


        tokenRepository.delete(tokenEntity);

        return true;
    }
}
