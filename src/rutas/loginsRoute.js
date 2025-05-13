const { Router } = require('express');
const { body, query } = require('express-validator');
const LoginsController = require("../controladores/LoginsControllers");
const rutas = Router();


rutas.get('/', LoginsController.Inicio);
rutas.get('/listar', LoginsController.listarLogins);

rutas.post('/guardar', LoginsController.guardarLogin);

rutas.put("/editar/:_id",
LoginsController.editar);



module.exports = rutas;
    