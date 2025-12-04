package merchpoint.repository;

import merchpoint.model.PointsTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PointsTransactionRepository extends JpaRepository<PointsTransaction, Long> {
    List<PointsTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<PointsTransaction> findByUserIdAndTypeOrderByCreatedAtDesc(Long userId, String type);
    Optional<PointsTransaction> findByCode(String code);
}
