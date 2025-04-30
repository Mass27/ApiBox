const { Router } = require('express');
const { body, query } = require('express-validator');
const LoginsController = require("../controladores/LoginsControllers"); // Asegúrate de proporcionar la ruta correcta
const rutas = Router();

// Rutas para operaciones CRUD en empleados
rutas.get('/', LoginsController.Inicio);
rutas.get('/listar', LoginsController.listarLogins);

rutas.post('/guardar', LoginsController.guardarLogin);

rutas.put("/editar/:_id",
LoginsController.editar);

// rutas.delete('/eliminar/:idusuario',
// query('_id').isInt().withMessage('Solo se permiten valores enteros'),
// LoginsController.eliminarUsuario);

module.exports = rutas;
    