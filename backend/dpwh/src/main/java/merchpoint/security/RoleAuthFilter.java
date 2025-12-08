package merchpoint.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class RoleAuthFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        String path = httpRequest.getRequestURI();
        String method = httpRequest.getMethod();
        
        // Allow OPTIONS requests for CORS preflight
        if ("OPTIONS".equals(method)) {
            chain.doFilter(request, response);
            return;
        }
        
        // Allow all GET requests for browsing
        if ("GET".equals(method)) {
            chain.doFilter(request, response);
            return;
        }
        
        // Get role from header (in production, use JWT token)
        String userRole = httpRequest.getHeader("X-User-Role");
        
        // Protect admin-only endpoints
        if (isAdminOnlyEndpoint(path, method)) {
            if (!"admin".equals(userRole)) {
                httpResponse.setStatus(HttpServletResponse.SC_FORBIDDEN);
                httpResponse.getWriter().write("{\"error\": \"Access denied. Admin role required.\"}");
                return;
            }
        }
        
        chain.doFilter(request, response);
    }
    
    private boolean isAdminOnlyEndpoint(String path, String method) {
        // Product management - only admin can create/update/delete
        if (path.contains("/api/product") && ("POST".equals(method) || "PUT".equals(method) || "DELETE".equals(method))) {
            return true;
        }
        
        // Category management - only admin can create/update/delete
        if (path.contains("/api/category") && ("POST".equals(method) || "PUT".equals(method) || "DELETE".equals(method))) {
            return true;
        }
        
        // User management - only admin can access (except PUT for profile update)
        if (path.contains("/api/user") && !"POST".equals(method) && !"PUT".equals(method)) {
            return true;
        }
        
        // Reservation approval/rejection - only admin
        if (path.contains("/api/reservation") && ("PUT".equals(method) || "DELETE".equals(method))) {
            return true;
        }
        
        return false;
    }
}
