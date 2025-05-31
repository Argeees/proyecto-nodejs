const Employee = require('../models/Employee'); 

const employeeController = {
  getAllEmployees: async (req, res) => {
    try {
      const employees = await Employee.getAll();
      res.status(200).json(employees);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      res.status(500).json({ message: 'Error en el servidor al obtener empleados' });
    }
  },

  getEmployeeById: async (req, res) => {
    try {
      const { id } = req.params;
      const employee = await Employee.getById(id);
      if (!employee) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }
      res.status(200).json(employee);
    } catch (error) {
      console.error('Error al obtener empleado por ID:', error);
      res.status(500).json({ message: 'Error en el servidor al obtener empleado' });
    }
  },

  createEmployee: async (req, res) => {
    try {
      const { nombre, apellidos, telefono, correo_electronico, direccion } = req.body;
      // Validación 
      if (!nombre || !apellidos || !telefono || !correo_electronico || !direccion) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
      }

      const newEmployeeId = await Employee.create(req.body);
      res.status(201).json({ message: 'Empleado creado exitosamente', id: newEmployeeId });
    } catch (error) {
      console.error('Error al crear empleado:', error);
      res.status(500).json({ message: 'Error en el servidor al crear empleado' });
    }
  },

  updateEmployee: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, apellidos, telefono, correo_electronico, direccion } = req.body;
      // Validación 
      if (!nombre || !apellidos || !telefono || !correo_electronico || !direccion) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
      }
      const affectedRows = await Employee.update(id, req.body);
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Empleado no encontrado o no se realizaron cambios' });
      }
      res.status(200).json({ message: 'Empleado actualizado exitosamente' });
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      res.status(500).json({ message: 'Error en el servidor al actualizar empleado' });
    }
  },

  deleteEmployee: async (req, res) => {
    try {
      const { id } = req.params;
      const affectedRows = await Employee.delete(id);
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }
      res.status(200).json({ message: 'Empleado eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      res.status(500).json({ message: 'Error en el servidor al eliminar empleado' });
    }
  },

  searchEmployees: async (req, res) => {
    try {
      const { name } = req.query; // Obtener el parámetro de búsqueda
      if (!name) {
        return res.status(400).json({ message: 'El parámetro "name" es obligatorio para la búsqueda.' });
      }
      const employees = await Employee.searchByName(name);
      res.status(200).json(employees);
    } catch (error) {
      console.error('Error al buscar empleados:', error);
      res.status(500).json({ message: 'Error en el servidor al buscar empleados' });
    }
  }
};

module.exports = employeeController;