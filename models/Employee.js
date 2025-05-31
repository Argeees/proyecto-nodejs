const pool = require('../db');

const Employee = {
  getAll: async () => {
    const [rows] = await pool.execute('SELECT * FROM employees');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.execute('SELECT * FROM employees WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (employeeData) => {
    const { nombre, apellidos, telefono, correo_electronico, direccion } = employeeData;
    const [result] = await pool.execute(
      'INSERT INTO employees (nombre, apellidos, telefono, correo_electronico, direccion) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellidos, telefono, correo_electronico, direccion]
    );
    return result.insertId;
  },

  update: async (id, employeeData) => {
    const { nombre, apellidos, telefono, correo_electronico, direccion } = employeeData;
    const [result] = await pool.execute(
      'UPDATE employees SET nombre = ?, apellidos = ?, telefono = ?, correo_electronico = ?, direccion = ? WHERE id = ?',
      [nombre, apellidos, telefono, correo_electronico, direccion, id]
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await pool.execute('DELETE FROM employees WHERE id = ?', [id]);
    return result.affectedRows;
  },

  searchByName: async (name) => {
    const searchTerm = `%${name}%`; // Para buscar nombres que contengan el trmino
    const [rows] = await pool.execute(
      'SELECT * FROM employees WHERE nombre LIKE ? OR apellidos LIKE ?',
      [searchTerm, searchTerm]
    );
    return rows;
  }
};

module.exports = Employee;