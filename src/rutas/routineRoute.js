const { Router } = require('express');
const { body, query } = require('express-validator');
const rutinasController = require("../controladores/routinecontroller"); // Asegúrate de proporcionar la ruta correcta
const rutas = Router();
const multer = require('multer');
const path = require('path');

// Formato para el guardado de las imágenes locales (si las rutinas incluyen imágenes)
const storageRutinas = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '../public/img/rutinas'));
    },
    filename: function(req, file, cb){
        // Generación de nombre único para cada archivo
        const nombreUnico = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, "RUTINA" + '-' + nombreUnico + '-' + file.mimetype.replace('/','.') );
        // Ejemplo: RUTINA-1689111650726-393957070-rutina.jpg
    } 
});
const uploadRutinas = multer({storage: storageRutinas});

// Rutas para operaciones CRUD en rutinas
rutas.get("/", rutinasController.Inicio); // Información general sobre el módulo de rutinas
rutas.get("/listar", rutinasController.listarRutinas); // Listar todas las rutinas
rutas.get("/obtener/:idrutina", rutinasController.obtenerRutinaPorId); // Obtener una rutina por su ID
rutas.post("/guardar", 
    body('nombre').notEmpty().withMessage('El nombre de la rutina es obligatorio'),
    body('descripcion').notEmpty().withMessage('La descripción de la rutina es obligatoria'),
    rutinasController.guardarRutina); // Guardar una nueva rutina
rutas.put("/editar/:idrutina", 
    body('nombre').notEmpty().withMessage('El nombre de la rutina es obligatorio'),
    body('descripcion').notEmpty().withMessage('La descripción de la rutina es obligatoria'),
    rutinasController.editarRutina); // Editar una rutina existente
rutas.delete("/eliminar/:idrutina", rutinasController.eliminarRutina); // Eliminar una rutina por su ID
rutas.get('/buscar/:nombre', rutinasController.buscarRutinaPorNombre);
module.exports = rutas;
