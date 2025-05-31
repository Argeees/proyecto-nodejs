const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');

//  las rutas requieren autenticación
router.use(authMiddleware.authenticate);

// Rutas de empleados
router.get('/', employeeController.getAllEmployees);
router.get('/search', employeeController.searchEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/', authMiddleware.isAdmin, employeeController.createEmployee);
router.put('/:id', authMiddleware.isAdmin, employeeController.updateEmployee);
router.delete('/:id', authMiddleware.isAdmin, employeeController.deleteEmployee);

module.exports = router;