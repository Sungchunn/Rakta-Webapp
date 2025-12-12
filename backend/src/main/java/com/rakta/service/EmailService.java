package com.rakta.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String fromEmail;

    public EmailService(JavaMailSender mailSender,
            @Value("${spring.mail.username}") String fromEmail) {
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;
    }

    /**
     * Send password reset email with a clickable link.
     * 
     * @param toEmail   The user's email address
     * @param resetLink The full URL for password reset (e.g.,
     *                  https://app.com/reset-password?token=xyz)
     */
    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Rakta: Reset Your Password");
        message.setText(
                "Hello,\n\n" +
                        "A password reset was requested for your Rakta account.\n\n" +
                        "Click the link below to reset your password:\n\n" +
                        resetLink + "\n\n" +
                        "This link will expire in 30 minutes.\n\n" +
                        "If you did not request this reset, please ignore this email. Your account is safe.\n\n" +
                        "Best regards,\n" +
                        "The Rakta Team");

        mailSender.send(message);
    }

    /**
     * Send a welcome email to new users.
     */
    public void sendWelcomeEmail(String toEmail, String firstName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Welcome to Rakta!");
        message.setText(
                "Hello " + firstName + ",\n\n" +
                        "Welcome to Rakta! Your account has been created successfully.\n\n" +
                        "You're now part of a community dedicated to making blood donation a positive lifestyle.\n\n" +
                        "Start by tracking your first donation or exploring donation centers near you.\n\n" +
                        "Best regards,\n" +
                        "The Rakta Team");

        mailSender.send(message);
    }
}
