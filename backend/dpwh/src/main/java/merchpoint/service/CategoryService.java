package merchpoint.service;

import merchpoint.model.CategoryEntity;
import merchpoint.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    // Create
    public CategoryEntity createCategory(CategoryEntity category) {
        return categoryRepository.save(category);
    }
    
    // Read All
    public List<CategoryEntity> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    // Read One
    public Optional<CategoryEntity> getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId);
    }
    
    // Update
    public CategoryEntity updateCategory(Long categoryId, CategoryEntity categoryDetails) {
        CategoryEntity category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
        
        category.setCategoryName(categoryDetails.getCategoryName());
        category.setDescription(categoryDetails.getDescription());
        
        return categoryRepository.save(category);
    }
    
    // Delete
    public void deleteCategory(Long categoryId) {
        CategoryEntity category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
        categoryRepository.delete(category);
    }
}
