package merchpoint.controller;

import merchpoint.model.*;
import merchpoint.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/reservation")
@CrossOrigin(origins = "*")
@SuppressWarnings("null")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ReservationItemRepository reservationItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PointsTransactionRepository pointsTransactionRepository;

    @GetMapping
    public List<Reservation> getAllReservations(@RequestParam(required = false) Boolean archived) {
        if (archived != null) {
            return reservationRepository.findByArchivedOrderByCreatedAtDesc(archived);
        }
        return reservationRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Map<String, Object>> getReservationsByUser(@PathVariable Long userId) {
        List<Reservation> reservations = reservationRepository.findByUserId(userId);
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (Reservation reservation : reservations) {
            Map<String, Object> resMap = new HashMap<>();
            resMap.put("id", reservation.getId());
            resMap.put("code", reservation.getCode());
            resMap.put("userId", reservation.getUserId());
            resMap.put("totalAmount", reservation.getTotalAmount());
            resMap.put("pointsUsed", reservation.getPointsUsed());
            resMap.put("pointsEarned", reservation.getPointsEarned());
            resMap.put("status", reservation.getStatus());
            resMap.put("createdAt", reservation.getCreatedAt());
            
            // Get items count
            List<ReservationItem> items = reservationItemRepository.findByReservationId(reservation.getId());
            resMap.put("itemCount", items.size());
            
            result.add(resMap);
        }
        
        return result;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getReservationById(@PathVariable Long id) {
        Optional<Reservation> reservationOpt = reservationRepository.findById(id);
        
        if (!reservationOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Reservation reservation = reservationOpt.get();
        List<ReservationItem> items = reservationItemRepository.findByReservationId(id);
        
        // Get product details for each item
        List<Map<String, Object>> itemDetails = new ArrayList<>();
        for (ReservationItem item : items) {
            Optional<ProductEntity> productOpt = productRepository.findById(item.getProductId());
            if (productOpt.isPresent()) {
                ProductEntity product = productOpt.get();
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("id", item.getId());
                itemMap.put("productId", item.getProductId());
                itemMap.put("productName", product.getProductName());
                itemMap.put("quantity", item.getQuantity());
                itemMap.put("price", item.getPrice());
                itemMap.put("subtotal", item.getPrice() * item.getQuantity());
                itemDetails.add(itemMap);
            }
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("id", reservation.getId());
        result.put("code", reservation.getCode());
        result.put("userId", reservation.getUserId());
        result.put("totalAmount", reservation.getTotalAmount());
        result.put("pointsUsed", reservation.getPointsUsed());
        result.put("pointsEarned", reservation.getPointsEarned());
        result.put("status", reservation.getStatus());
        result.put("createdAt", reservation.getCreatedAt());
        result.put("items", itemDetails);
        
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            Double totalAmount = Double.valueOf(request.get("totalAmount").toString());
            Integer pointsUsed = request.containsKey("pointsUsed") ? Integer.valueOf(request.get("pointsUsed").toString()) : 0;
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> items = (List<Map<String, Object>>) request.get("items");

            // Validate user
            Optional<UserEntity> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                return ResponseEntity.badRequest().build();
            }
            
            UserEntity user = userOpt.get();
            
            // Check if user has enough points
            if (pointsUsed > 0 && user.getPointsBalance() < pointsUsed) {
                return ResponseEntity.badRequest().build();
            }

            // Calculate points earned: 20% of total amount, rounded
            // Only earn points if no discount was used
            Integer pointsEarned = (pointsUsed == 0) ? (int) Math.round(totalAmount * 0.20) : 0;

            // Generate reservation code
            String code = "RES-" + String.format("%03d", reservationRepository.count() + 1);

            // Create reservation
            Reservation reservation = new Reservation();
            reservation.setCode(code);
            reservation.setUserId(userId);
            reservation.setTotalAmount(totalAmount);
            reservation.setPointsUsed(pointsUsed);
            reservation.setPointsEarned(pointsEarned);
            reservation.setStatus("PENDING");
            reservation = reservationRepository.save(reservation);

            // Create reservation items
            for (Map<String, Object> itemData : items) {
                ReservationItem item = new ReservationItem();
                item.setReservationId(reservation.getId());
                item.setProductId(Long.valueOf(itemData.get("productId").toString()));
                item.setQuantity(Integer.valueOf(itemData.get("quantity").toString()));
                item.setPrice(Double.valueOf(itemData.get("price").toString()));
                reservationItemRepository.save(item);
            }

            // Update user points
            if (pointsUsed > 0) {
                user.setPointsBalance(user.getPointsBalance() - pointsUsed);
                
                // Create points transaction for redemption
                String txnCode = "TXN-" + String.format("%04d", pointsTransactionRepository.count() + 1);
                PointsTransaction transaction = new PointsTransaction();
                transaction.setCode(txnCode);
                transaction.setUserId(userId);
                transaction.setType("REDEEMED");
                transaction.setPoints(-pointsUsed);
                transaction.setBalanceAfter(user.getPointsBalance());
                transaction.setDescription("Points redeemed for " + code);
                transaction.setReservationId(reservation.getId());
                pointsTransactionRepository.save(transaction);
            }
            
            userRepository.save(user);

            // Return success response with reservation data
            Map<String, Object> response = new HashMap<>();
            response.put("id", reservation.getId());
            response.put("code", reservation.getCode());
            response.put("userId", reservation.getUserId());
            response.put("totalAmount", reservation.getTotalAmount());
            response.put("pointsUsed", reservation.getPointsUsed());
            response.put("pointsEarned", reservation.getPointsEarned());
            response.put("status", reservation.getStatus());
            response.put("createdAt", reservation.getCreatedAt() != null ? reservation.getCreatedAt().toString() : null);
            response.put("success", true);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            // Return proper JSON error response
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage() != null ? e.getMessage() : "Failed to create reservation");
            errorResponse.put("message", "Reservation may have been created but response failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Reservation> updateReservationStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> request) {
        
        Optional<Reservation> reservationOpt = reservationRepository.findById(id);
        
        if (!reservationOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Reservation reservation = reservationOpt.get();
        String newStatus = request.get("status");
        String oldStatus = reservation.getStatus();
        reservation.setStatus(newStatus);
        reservation = reservationRepository.save(reservation);
        
        // Handle points based on status change
        Optional<UserEntity> userOpt = userRepository.findById(reservation.getUserId());
        if (userOpt.isPresent()) {
            UserEntity user = userOpt.get();
            
            // If approved, award points
            if ("APPROVED".equals(newStatus) && !"APPROVED".equals(oldStatus)) {
                user.setPointsBalance(user.getPointsBalance() + reservation.getPointsEarned());
                
                // Create points transaction for earning
                String txnCode = "TXN-" + String.format("%04d", pointsTransactionRepository.count() + 1);
                PointsTransaction transaction = new PointsTransaction();
                transaction.setCode(txnCode);
                transaction.setUserId(user.getUserId());
                transaction.setType("EARNED");
                transaction.setPoints(reservation.getPointsEarned());
                transaction.setBalanceAfter(user.getPointsBalance());
                transaction.setDescription("Points earned from " + reservation.getCode());
                transaction.setReservationId(reservation.getId());
                pointsTransactionRepository.save(transaction);
            }
            
            // If rejected, refund redeemed points
            if ("REJECTED".equals(newStatus) && reservation.getPointsUsed() > 0) {
                user.setPointsBalance(user.getPointsBalance() + reservation.getPointsUsed());
                
                // Create points transaction for refund
                String txnCode = "TXN-" + String.format("%04d", pointsTransactionRepository.count() + 1);
                PointsTransaction transaction = new PointsTransaction();
                transaction.setCode(txnCode);
                transaction.setUserId(user.getUserId());
                transaction.setType("REFUND");
                transaction.setPoints(reservation.getPointsUsed());
                transaction.setBalanceAfter(user.getPointsBalance());
                transaction.setDescription("Points refunded from " + reservation.getCode());
                transaction.setReservationId(reservation.getId());
                pointsTransactionRepository.save(transaction);
            }
            
            userRepository.save(user);
        }
        
        return ResponseEntity.ok(reservation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        if (!reservationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        // Delete items first
        List<ReservationItem> items = reservationItemRepository.findByReservationId(id);
        for (ReservationItem item : items) {
            reservationItemRepository.delete(item);
        }
        
        reservationRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/archive")
    public ResponseEntity<Reservation> archiveReservation(@PathVariable Long id) {
        Optional<Reservation> reservationOpt = reservationRepository.findById(id);
        if (!reservationOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Reservation reservation = reservationOpt.get();
        reservation.setArchived(true);
        reservationRepository.save(reservation);
        return ResponseEntity.ok(reservation);
    }

    @PatchMapping("/{id}/unarchive")
    public ResponseEntity<Reservation> unarchiveReservation(@PathVariable Long id) {
        Optional<Reservation> reservationOpt = reservationRepository.findById(id);
        if (!reservationOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Reservation reservation = reservationOpt.get();
        reservation.setArchived(false);
        reservationRepository.save(reservation);
        return ResponseEntity.ok(reservation);
    }

    @PostMapping("/archive-multiple")
    public ResponseEntity<Map<String, Object>> archiveMultipleReservations(@RequestBody Map<String, List<Long>> request) {
        List<Long> ids = request.get("ids");
        int archived = 0;
        
        for (Long id : ids) {
            Optional<Reservation> reservationOpt = reservationRepository.findById(id);
            if (reservationOpt.isPresent()) {
                Reservation reservation = reservationOpt.get();
                reservation.setArchived(true);
                reservationRepository.save(reservation);
                archived++;
            }
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("archived", archived);
        response.put("total", ids.size());
        return ResponseEntity.ok(response);
    }
}
