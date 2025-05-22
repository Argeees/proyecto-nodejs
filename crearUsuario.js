const bcrypt = require('bcryptjs');
const db = require('./db'); // asegúrate de que esté bien conectado

bcrypt.hash('admin123', 10).then(hash => {
  db.query('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', hash], (err, result) => {
    if (err) {
      console.error('Error al crear usuario:', err);
    } else {
      console.log('✅ Usuario creado correctamente');
    }
    process.exit(); // Cierra el programa
  });
});
