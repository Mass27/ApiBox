const { Router } = require('express');
const facturaController = require("../controladores/facturacionController"); 
const rutas = Router();


rutas.get("/", facturaController.Inicio);
rutas.get("/listar", facturaController.listarFacturas);
rutas.get("/buscarCli/:nombreCliente", facturaController.obtenerFacturaPorNombreCliente);
rutas.get("/buscar/:idfacturacion", facturaController.obtenerFacturaPorId);
rutas.post("/guardar", facturaController.guardarFacturacion);
rutas.put("/editar/:idfacturacion", facturaController.editarFacturacion);
rutas.delete("/eliminar/:idfacturacion", facturaController.eliminarFacturacion);
rutas.post('/enviar/:idfacturacion', facturaController.enviarFacturaPorCorreo);

module.exports = rutas;
