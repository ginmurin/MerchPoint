package merchpoint.controller;

import merchpoint.model.UserEntity;
import merchpoint.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    /**
     * Login endpoint
     * POST /api/auth/login
     * Body: { "email": "user@example.com", "password": "password123" }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String emailOrUsername = loginRequest.get("email");
        String password = loginRequest.get("password");
        
        System.out.println("=== Login Attempt ===");
        System.out.println("Email/Username: " + emailOrUsername);
        System.out.println("Password length: " + (password != null ? password.length() : "null"));
        
        // Find user by email OR username
        Optional<UserEntity> userOptional = userService.getUserByEmail(emailOrUsername);
        
        // If not found by email, try username
        if (userOptional.isEmpty()) {
            userOptional = userService.getUserByUsername(emailOrUsername);
        }
        
        if (userOptional.isEmpty()) {
            System.out.println("ERROR: User not found with email/username: " + emailOrUsername);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid email or password");
            return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
        }
        
        UserEntity user = userOptional.get();
        System.out.println("User found - Username: " + user.getUsername());
        System.out.println("Stored password length: " + user.getPassword().length());
        System.out.println("Passwords match: " + user.getPassword().equals(password));
        
        if (!user.getPassword().equals(password)) {
            System.out.println("ERROR: Password mismatch");
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid email or password");
            return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
        }
        
        System.out.println("SUCCESS: Login successful for " + emailOrUsername);
        
        // Create response with user data (without password)
        Map<String, Object> response = new HashMap<>();
        response.put("userId", user.getUserId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("points", user.getPointsBalance());
        response.put("name", user.getFullName() != null ? user.getFullName() : user.getUsername());
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    /**
     * Register endpoint
     * POST /api/auth/register
     * Body: { "username": "john", "email": "john@example.com", "password": "password123" }
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserEntity user) {
        try {
            // Check if email already exists
            if (userService.existsByEmail(user.getEmail())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Email already exists");
                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
            }
            
            // Check if username already exists
            if (userService.existsByUsername(user.getUsername())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Username already exists");
                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
            }
            
            // Set default values
            if (user.getRole() == null || user.getRole().isEmpty()) {
                user.setRole("user");
            }
            if (user.getPointsBalance() == null) {
                user.setPointsBalance(0);
            }
            
            // Create user (NOTE: In production, hash the password!)
            UserEntity createdUser = userService.createUser(user);
            
            // Log success
            System.out.println("User created successfully: " + createdUser.getUserId());
            
            // Create response (without password)
            Map<String, Object> response = new HashMap<>();
            response.put("userId", createdUser.getUserId());
            response.put("username", createdUser.getUsername());
            response.put("email", createdUser.getEmail());
            response.put("role", createdUser.getRole());
            response.put("points", createdUser.getPointsBalance());
            response.put("name", createdUser.getFullName() != null ? createdUser.getFullName() : createdUser.getUsername());
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error creating user: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to create user: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
