const db = require('../db');

const employeeController = {
  getAllEmployees: (req, res) => {
    db.query('SELECT * FROM employees', (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al obtener empleados' });
      }
      res.json(results);
    });
  },

  getEmployeeById: (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM employees WHERE id = ?', [id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al obtener empleado' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }
      res.json(results[0]);
    });
  },

  searchEmployees: (req, res) => {
    const { name } = req.query;
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'El parámetro de búsqueda es requerido' });
    }
    
    db.query('SELECT * FROM employees WHERE nombre LIKE ?', [`%${name}%`], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al buscar empleados' });
      }
      res.json(results);
    });
  },

  createEmployee: (req, res) => {
    const { nombre, apellidos } = req.body;
    
    if (!nombre || !apellidos) {
      return res.status(400).json({ message: 'Nombre y apellidos son requeridos' });
    }
    
    const employee = {
      nombre,
      apellidos,
      telefono: req.body.telefono || null,
      correo: req.body.correo || null,
      direccion: req.body.direccion || null
    };
    
    db.query('INSERT INTO employees SET ?', employee, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al crear empleado' });
      }
      res.status(201).json({ id: result.insertId, ...employee });
    });
  },

  updateEmployee: (req, res) => {
    const { id } = req.params;
    const { nombre, apellidos } = req.body;
    
    if (!nombre || !apellidos) {
      return res.status(400).json({ message: 'Nombre y apellidos son requeridos' });
    }
    
    const employee = {
      nombre,
      apellidos,
      telefono: req.body.telefono || null,
      correo: req.body.correo || null,
      direccion: req.body.direccion || null
    };
    
    db.query('UPDATE employees SET ? WHERE id = ?', [employee, id], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al actualizar empleado' });
      }
      res.json({ id, ...employee });
    });
  },

  deleteEmployee: (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM employees WHERE id = ?', [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al eliminar empleado' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }
      res.json({ message: 'Empleado eliminado correctamente' });
    });
  }
};

module.exports = employeeController;