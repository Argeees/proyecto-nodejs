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
    // Verificar si el usuario es administrador
    if (req.user && req.user.role === 'admin') { 
      next(); // El usuario es administrador, permite el acceso
    } else {
      return res.status(403).json({ message: 'Acceso denegado: Se requieren permisos de administrador' });
    }
  }
};

module.exports = authMiddleware;