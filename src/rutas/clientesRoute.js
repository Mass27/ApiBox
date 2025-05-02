const { Router } = require('express');
const clientesController = require("../controladores/clientesController"); // Asegúrate de proporcionar la ruta correcta
const rutas = Router();
const multer = require('multer');
const path = require('path');
const { ValidarAutenticado } = require('../configuraciones/passport');



//Formato para el guardado de las imagenes locales 
const storageClientes = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '../public/img/clientes'));
    },
    filename: function(req, file, cb){
        // fecha actual + funcion matematica que multiplica un numero aleatorio * 1E9
        const nombreUnico = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, "HOLA" + '-' + nombreUnico + '-' + file.mimetype.replace('/','.'));
        //HOLA-1689111650726-393957070-neymarJr.jpeg
    } 
});
const uploadClientes = multer({storage: storageClientes});

// Rutas para operaciones CRUD en clientes
rutas.get("/", clientesController.Inicio);
rutas.get("/listar", clientesController.listarClientes);
rutas.get("/listar/clientesAct", clientesController.listarClientesActivos);
rutas.get("/contar/clientesAct", clientesController.contarClientesActivos);
rutas.get("/listar/clientesIna", clientesController.listarClientesInactivos);
rutas.get("/listar/clientesPen", clientesController.listarClientesPendientes);
rutas.get("/buscar/:nombreCliente", clientesController.listarClientesPorNombre);

rutas.get('/listarId/:idCliente', clientesController.buscarClientePorId);
rutas.post("/guardar", clientesController.guardarCliente);
rutas.put("/editar/:idcliente", clientesController.editarCliente);
rutas.delete("/eliminar/:idcliente", clientesController.eliminarCliente);
rutas.post('/asignar-rutina', clientesController.asignarRutinaACliente);
rutas.get('/rutina-asignada/:clienteId', clientesController.obtenerRutinasAsignadas);
rutas.post('/eliminar-rutina/:clienteId/:rutinaId', clientesController.eliminarRutina);
rutas.post('/cargarimagen',
uploadClientes.single('img'),
clientesController.UploadImage);


module.exports = rutas;
