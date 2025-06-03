const { Router } = require('express');
const productoscontroller = require("../controladores/productosController");
const rutas = Router();
const multer = require('multer');
const path = require('path');

// Configuración de multer para guardar imágenes localmente antes de subir a Cloudinary:
const storageProductos = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../public/img/productos'));
  },
  filename: function(req, file, cb) {
    const nombreUnico = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = file.mimetype.split('/')[1];
    cb(null, `prod-${nombreUnico}.${extension}`);
  }
});
const uploadProductos = multer({ storage: storageProductos });


rutas.get("/", productoscontroller.Inicio);
rutas.get("/listar", productoscontroller.listarProductos);


rutas.get("/buscar/:idproducto", productoscontroller.obteneProductoPorId);


rutas.get("/buscarnombre/:nombreProducto", productoscontroller.listarProductosPorNombre);


rutas.post("/guardar", productoscontroller.guardarProducto);


rutas.put("/editar/:idproducto", productoscontroller.editarProducto);


rutas.delete("/eliminar/:idproducto", productoscontroller.eliminarProducto);

rutas.get("/metrics", productoscontroller.obtenerMetrics);


rutas.post(
  "/cargarimagen",
  uploadProductos.single('img'),
  productoscontroller.UploadImage
);

module.exports = rutas;
