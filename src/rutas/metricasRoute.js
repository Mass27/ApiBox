const { Router } = require('express');
const metricasController = require('../controladores/metricasController');
const rutas = Router();

// Rutas para operaciones CRUD en métricas
rutas.get('/', metricasController.Inicio);
rutas.get('/listar', metricasController.listarMetricas);
rutas.post('/guardar', metricasController.guardarMetrica);
rutas.get('/cliente/:id', metricasController.metricasPorCliente);

module.exports = rutas;
