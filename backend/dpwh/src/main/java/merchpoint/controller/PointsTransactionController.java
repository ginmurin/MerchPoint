package merchpoint.controller;

import merchpoint.model.PointsTransaction;
import merchpoint.repository.PointsTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/points")
@CrossOrigin(origins = "*")
public class PointsTransactionController {

    @Autowired
    private PointsTransactionRepository pointsTransactionRepository;

    @GetMapping("/user/{userId}")
    public List<PointsTransaction> getUserTransactions(@PathVariable Long userId) {
        return pointsTransactionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @GetMapping("/user/{userId}/type/{type}")
    public List<PointsTransaction> getUserTransactionsByType(
            @PathVariable Long userId, 
            @PathVariable String type) {
        return pointsTransactionRepository.findByUserIdAndTypeOrderByCreatedAtDesc(userId, type);
    }

    @GetMapping
    public List<PointsTransaction> getAllTransactions() {
        return pointsTransactionRepository.findAll();
    }
}
