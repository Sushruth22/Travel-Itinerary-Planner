package com.travelplanner.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Hello from backend!");
    }

    @GetMapping("/trips")
    public ResponseEntity<String> testTrips() {
        return ResponseEntity.ok("{\"content\":[], \"totalElements\":0}");
    }
}
