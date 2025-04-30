const { Router } = require('express');
const productoscontroller = require("../controladores/productosController"); // Asegúrate de proporcionar la ruta correcta
const rutas = Router();
const multer = require('multer');
const path = require('path');

//Formato para el guardado de las imagenes locales 
const storageProductos = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '../public/img/productos'));
    },
    filename: function(req, file, cb){
        // fecha actual + funcion matematica que multiplica un numero aleatorio * 1E9
        const nombreUnico = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, "HOLA" + '-' + nombreUnico + '-' + file.mimetype.replace('/','.'));
        //HOLA-1689111650726-393957070-neymarJr.jpeg
    } 
});
const uploadProductos = multer({storage: storageProductos});

// Rutas para operaciones CRUD en productos 
rutas.get("/", productoscontroller.Inicio);
rutas.get("/listar", productoscontroller.listarProductos);
rutas.get("/buscar/:idproducto", productoscontroller.obteneProductoPorId);
rutas.get("/buscarnombre/:nombreProducto", productoscontroller.listarProductosPorNombre);
rutas.post("/guardar", productoscontroller.guardarProducto);
rutas.put("/editar/:idproducto", productoscontroller.editarProducto);
rutas.delete("/eliminar/:idproducto", productoscontroller.eliminarProducto);

rutas.post('/cargarimagen',
uploadProductos.single('img'),
productoscontroller.UploadImage);


module.exports = rutas;
