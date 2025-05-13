const { Router } = require('express');
const { body, query } = require('express-validator');
const empleadosController = require("../controladores/empleadosController"); 
const rutas = Router();
const multer = require('multer');
const path = require('path');

//Formato para el guardado de las imagenes locales 
const storageEmpleados = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '../public/img/empleados'));
    },
    filename: function(req, file, cb){
        
        const nombreUnico = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, "HOLA" + '-' + nombreUnico + '-' + file.mimetype.replace('/','.'));
     
    } 
});
const uploadEmpleados = multer({storage: storageEmpleados});


rutas.get("/", empleadosController.Inicio);
rutas.get("/listar", empleadosController.listarEmpleados);
rutas.get("/buscar/:idempleado", empleadosController.obtenerEmpleadoPorId);
rutas.get("/buscarnombre/:nombreCompleto", empleadosController.obtenerEmpleadoPorNombre);
rutas.post("/guardar",
body('numeroTelefono').isLength({ min:8, max: 8}).withMessage('El campo telefono debe tener 8 caracteres'),
empleadosController.guardarEmpleado);
rutas.put("/editar/:idempleado", 
body('numeroTelefono').isLength({ min:8, max: 8}).withMessage('El campo telefono debe tener 8 caracteres'),
empleadosController.editarEmpleado);
rutas.delete("/eliminar/:idempleado", empleadosController.eliminarEmpleado);

module.exports = rutas;
