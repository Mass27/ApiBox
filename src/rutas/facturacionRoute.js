const { Router } = require('express');
const facturaController = require("../controladores/facturacionController"); // Asegúrate de proporcionar la ruta correcta
const rutas = Router();

// Rutas para operaciones CRUD en Facturacion
rutas.get("/", facturaController.Inicio);
rutas.get("/listar", facturaController.listarFacturas);
rutas.get("/buscarCli/:nombreCliente", facturaController.obtenerFacturaPorNombreCliente);
rutas.get("/buscar/:idfacturacion", facturaController.obtenerFacturaPorId);
rutas.post("/guardar", facturaController.guardarFacturacion);
rutas.put("/editar/:idfacturacion", facturaController.editarFacturacion);
rutas.delete("/eliminar/:idfacturacion", facturaController.eliminarFacturacion);

module.exports = rutas;
