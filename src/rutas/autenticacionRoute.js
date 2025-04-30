const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const autenticacionController = require('../controladores/autenticacionController');

// Definir la ruta GET para el inicio de sesión
router.post('/inicioSesion',  autenticacionController.inicioSesion);



module.exports = router;
