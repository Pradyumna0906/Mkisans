/**
 * MKisans Authentication Middleware
 * (Placeholder for future JWT implementation)
 */

const authenticateToken = (req, res, next) => {
  // For now, we bypass security to allow the server to run.
  // In a production environment, this would verify a JWT.
  
  // Mock a user if not present (using IDs from request body if available)
  if (!req.user) {
    req.user = {
      id: req.body.kisanId || req.body.userContext?.userId || 1,
      role: 'farmer'
    };
  }
  
  next();
};

module.exports = { authenticateToken };
