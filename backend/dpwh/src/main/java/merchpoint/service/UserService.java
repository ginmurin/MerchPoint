package merchpoint.service;

import merchpoint.model.UserEntity;
import merchpoint.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    // Create
    public UserEntity createUser(UserEntity user) {
        return userRepository.save(user);
    }
    
    // Read All
    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }
    
    // Read One
    public Optional<UserEntity> getUserById(Long userId) {
        return userRepository.findById(userId);
    }
    
    // Get User by Email (for login)
    public Optional<UserEntity> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    // Get User by Username (for login)
    public Optional<UserEntity> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    // Update
    public UserEntity updateUser(Long userId, UserEntity userDetails) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        
        // Only update password if provided
        if (userDetails.getPassword() != null && !userDetails.getPassword().trim().isEmpty()) {
            user.setPassword(userDetails.getPassword());
        }
        
        user.setRole(userDetails.getRole());
        user.setPointsBalance(userDetails.getPointsBalance());
        user.setFullName(userDetails.getFullName());
        user.setPhoneNumber(userDetails.getPhoneNumber());
        user.setAddress(userDetails.getAddress());
        user.setStudentStaffId(userDetails.getStudentStaffId());
        
        return userRepository.save(user);
    }
    
    // Delete
    public void deleteUser(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        userRepository.delete(user);
    }
    
    // Check if email exists
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    // Check if username exists
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
}
