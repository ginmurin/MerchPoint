package merchpoint.service;

import merchpoint.model.ProductEntity;
import merchpoint.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    // Create
    public ProductEntity createProduct(ProductEntity product) {
        return productRepository.save(product);
    }
    
    // Read All
    public List<ProductEntity> getAllProducts() {
        return productRepository.findAll();
    }
    
    // Read One
    public Optional<ProductEntity> getProductById(Long productId) {
        return productRepository.findById(productId);
    }
    
    // Update
    public ProductEntity updateProduct(Long productId, ProductEntity productDetails) {
        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        
        product.setProductName(productDetails.getProductName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setPointsRequired(productDetails.getPointsRequired());
        product.setPointsValue(productDetails.getPointsValue());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setImageUrl(productDetails.getImageUrl());
        product.setCategory(productDetails.getCategory());
        
        return productRepository.save(product);
    }
    
    // Delete
    public void deleteProduct(Long productId) {
        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        productRepository.delete(product);
    }
    
    // Get products by category
    public List<ProductEntity> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryCategoryId(categoryId);
    }
}
