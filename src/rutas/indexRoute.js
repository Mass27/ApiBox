const { Router } = require('express');

const controladorInicio = require('../controladores/inicioController');
const controladorEmpleados = require('../controladores/empleadosController');
const controladorClientes = require('../controladores/clientesController');
const controladorFacturacion = require('../controladores/facturacionController');
const controladorUsuarios = require('../controladores/usuariosController');
const controladorPlans = require('../controladores/plansController');
const controladorProductos = require('../controladores/productosController');
const controladorLogins = require('../controladores/LoginsControllers');
const controladorRutinas = require('../controladores/routinecontroller');
const rutas = Router();

rutas.get('/', controladorInicio.Inicio);
rutas.get('/inicio', controladorInicio.Inicio);
rutas.get('/usuarios', controladorUsuarios.Inicio);
rutas.get('/empleados', controladorEmpleados.Inicio);
rutas.get('/clientes', controladorClientes.Inicio);
rutas.get('/facturacion', controladorFacturacion.Inicio)
rutas.get('/planes', controladorPlans.Inicio);
rutas.get('/productos', controladorProductos.Inicio);
rutas.get('/logins', controladorLogins.Inicio)
rutas.get('/rutinas', controladorRutinas.Inicio);

module.exports= rutas;