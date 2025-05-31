const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findByUsername(username);

      if (!user) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }

      // Generar JWT incluyendo el ID del usuario y su rol
      
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role }, 
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token expira en 1 hora
      );

      res.status(200).json({ message: 'Login exitoso', token, role: user.role }); 
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ message: 'Error en el servidor al iniciar sesión' });
    }
  }
};

module.exports = authController;