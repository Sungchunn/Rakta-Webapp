package com.fitsloth.controller;

import com.fitsloth.entity.HealthLog;
import com.fitsloth.entity.User;
import com.fitsloth.repository.HealthLogRepository;
import com.fitsloth.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final HealthLogRepository healthLogRepository;
    private final UserRepository userRepository;

    public HealthController(HealthLogRepository healthLogRepository, UserRepository userRepository) {
        this.healthLogRepository = healthLogRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<HealthLog>> getUserHealthLogs(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return new ResponseEntity<>(healthLogRepository.findByUserIdOrderByDateDesc(user.getId()), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<HealthLog> logHealth(Authentication authentication, @RequestBody HealthLogRequest request) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();

        HealthLog log = healthLogRepository.findByUserIdAndDate(user.getId(), LocalDate.now())
                .orElse(HealthLog.builder().user(user).date(LocalDate.now()).build());

        if (request.sleepHours() != null)
            log.setSleepHours(request.sleepHours());
        if (request.feeling() != null)
            log.setFeeling(request.feeling());

        return new ResponseEntity<>(healthLogRepository.save(log), HttpStatus.OK);
    }

    public record HealthLogRequest(Integer sleepHours, String feeling) {
    }
}
