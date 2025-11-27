package merchpoint.repository;

import merchpoint.model.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
    List<ProductEntity> findByCategoryCategoryId(Long categoryId);
    List<ProductEntity> findByProductNameContaining(String productName);
}
