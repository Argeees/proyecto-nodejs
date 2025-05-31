const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config(); // Para cargar JWT_SECRET

async function createAdminUser() {
  const username = 'admin';
  const password = 'adminpassword'; // contraseña temporal
  const role = 'admin'; // Definimos el rol 

  try {
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      console.log(` El usuario '${username}' ya existe.`);

      return; // Salimos por  si el usuario ya existe para evitar duplicados
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await User.create(username, hashedPassword, role); 
    console.log(`Usuario '${username}' creado con ID: ${result.insertId} y rol: ${role}`);
  } catch (error) {
    console.error('Error al crear usuario:', error);
  } finally {

  }
}

createAdminUser();