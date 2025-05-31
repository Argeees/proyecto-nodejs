const pool = require('../db'); 

const User = {
  findByUsername: async (username) => {
    try {
      console.log(`Intentando buscar usuario: ${username}`);
      const [rows, fields] = await pool.execute( 
        'SELECT id, username, password, role FROM users WHERE username = ?',
        [username]
      );
      
      console.log('Resultado de la consulta (rows):', rows);
      console.log('Resultado de la consulta (fields):', fields);

      
      return rows[0]; 

    } catch (error) {
      // atrapar errores directamente de la ejecución de la consulta a la DB
      console.error('ERROR DETECTADO EN models/User.js -> findByUsername');
      console.error('Mensaje de error:', error.message);
      console.error('Código de error MySQL (si aplica):', error.code); 
      console.error('Número de error MySQL (si aplica):', error.errno);
      console.error('SQL State (si aplica):', error.sqlState);
      console.error('Consulta SQL que falló (si aplica):', error.sql);
      console.error('Stack trace:', error.stack);

      throw error; 
    }
  },
  
  create: async (username, hashedPassword, role = 'user') => {
    try {
      const [result] = await pool.execute(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [username, hashedPassword, role]
      );
      return result;
    } catch (error) {
      console.error('Error en User.create al crear usuario:', error.message);
      throw error;
    }
  }
};

module.exports = User;