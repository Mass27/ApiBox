const { Router } = require('express');
const clientesController = require("../controladores/clientesController"); 
const rutas = Router();
const multer = require('multer');
const path = require('path');
const { ValidarAutenticado } = require('../configuraciones/passport');




const storageClientes = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '../public/img/clientes'));
    },
    filename: function(req, file, cb){
    
        const nombreUnico = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, "HOLA" + '-' + nombreUnico + '-' + file.mimetype.replace('/','.'));

    } 
});
const uploadClientes = multer({storage: storageClientes});


rutas.get("/", clientesController.Inicio);
rutas.get("/listar", clientesController.listarClientes);
rutas.get("/listarPage", clientesController.listarClientesPage);
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
