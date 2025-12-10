package com.rakta.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationEmail(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Rakta: Verify your Email");
        message.setText("Welcome to the movement!\n\n" +
                "Please verify your account using this code:\n\n" +
                code + "\n\n" +
                "If you did not sign up, please ignore this email.");

        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Rakta: Reset Password");
        message.setText("A password reset was requested for your account.\n\n" +
                "Use this token to reset your password:\n\n" +
                token + "\n\n" +
                "Note: In a real app this would be a link like: https://rakta.app/auth/reset-password?token=" + token);

        mailSender.send(message);
    }
}
