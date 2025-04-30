const { Router } = require('express');
const planescontroller = require("../controladores/plansController"); // Asegúrate de proporcionar la ruta correcta
const rutas = Router();

// Rutas para operaciones CRUD en planes
rutas.get("/", planescontroller.Inicio);
rutas.get("/listar", planescontroller.listarPlanes);
rutas.get("/buscar/:idplan", planescontroller.buscarPlanPorId);
rutas.get("/buscarnombre/:nombrePlan", planescontroller.buscarPlanPorNombre);
rutas.post("/guardar", planescontroller.guardarPlanes);
rutas.put("/editar/:idplan", planescontroller.editarPlan);
rutas.delete("/eliminar/:idplan", planescontroller.eliminarPlan);


module.exports = rutas;
