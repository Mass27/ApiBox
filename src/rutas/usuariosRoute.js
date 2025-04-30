const { Router } = require('express');
const { body, query } = require('express-validator');
const UsuariosController = require("../controladores/usuariosController"); // Asegúrate de proporcionar la ruta correcta
const rutas = Router();

// Rutas para operaciones CRUD en empleados
rutas.get('/', UsuariosController.Inicio);
rutas.get('/listar', UsuariosController.listar);

rutas.post('/guardar',UsuariosController.GuardarUsuario);

rutas.put("/editar/:idusuario", UsuariosController.editarUsuario);

rutas.delete('/eliminar/:idusuario',
query('_id').isInt().withMessage('Solo se permiten valores enteros'),
UsuariosController.eliminarUsuario);

module.exports = rutas;
    