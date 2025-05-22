const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      
      User.findByUsername(username, async (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error del servidor' });
        }
        
        if (results.length === 0) {
          return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
          return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        
        const token = jwt.sign(
          { id: user.id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
        
        res.json({ token });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  verifyToken: (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
      return res.status(403).json({ message: 'Token no proporcionado' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token inválido' });
      }
      
      req.user = decoded;
      next();
    });
  }
};

module.exports = authController;