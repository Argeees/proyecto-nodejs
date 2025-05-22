const jwt = require('jsonwebtoken');

const authMiddleware = {
  authenticate: (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Acceso no autorizado: Token no proporcionado' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Error al verificar token:', error);
      return res.status(401).json({ message: 'Acceso no autorizado: Token inválido o expirado' });
    }
  },

  isAdmin: (req, res, next) => {
    // En un sistema real, aquí verificarías si el usuario tiene rol de admin
    // Por ahora asumimos que todos los usuarios autenticados son admin
    next();
  }
};

module.exports = authMiddleware;