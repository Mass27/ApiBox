const { Router } = require('express');
const { body, query } = require('express-validator');
const rutinasController = require("../controladores/routinecontroller"); 
const rutas = Router();
const multer = require('multer');
const path = require('path');


const storageRutinas = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '../public/img/rutinas'));
    },
    filename: function(req, file, cb){
        
        const nombreUnico = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, "RUTINA" + '-' + nombreUnico + '-' + file.mimetype.replace('/','.') );
        
    } 
});
const uploadRutinas = multer({storage: storageRutinas});


rutas.get("/", rutinasController.Inicio);
rutas.get("/listar", rutinasController.listarRutinas); 
rutas.get("/obtener/:idrutina", rutinasController.obtenerRutinaPorId); 
rutas.post("/guardar", 
    body('nombre').notEmpty().withMessage('El nombre de la rutina es obligatorio'),
    body('descripcion').notEmpty().withMessage('La descripción de la rutina es obligatoria'),
    rutinasController.guardarRutina); 
rutas.put("/editar/:idrutina", 
    body('nombre').notEmpty().withMessage('El nombre de la rutina es obligatorio'),
    body('descripcion').notEmpty().withMessage('La descripción de la rutina es obligatoria'),
    rutinasController.editarRutina); 
rutas.delete("/eliminar/:idrutina", rutinasController.eliminarRutina); 
rutas.get('/buscar/:nombre', rutinasController.buscarRutinaPorNombre);
module.exports = rutas;
