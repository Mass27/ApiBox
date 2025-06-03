const Productos = require("../models/productosModels");
const MSJ = require('../componentes/mensaje');
const multer = require('multer');
const { unlinkSync } = require('fs');
const cloudinary = require('cloudinary').v2;


exports.Inicio = (req, res) => {
  const moduloProductos = {
    modulo: 'productos',
    descripcion: 'Contiene la informacion de los productos',
    rutas: [
      {
        ruta: '/api/productos/listar',
        descripcion: 'Lista los productos',
        metodo: 'GET',
        parametros: 'ninguno'
      },
      {
        ruta: '/api/productos/guardar',
        descripcion: 'Guarda los productos',
        metodo: 'POST',
        parametros: 'ninguno'
      },
      {
        ruta: '/api/productos/editar/:idproducto',
        descripcion: 'Modifica los productos',
        metodo: 'PUT',
        parametros: 'idproducto'
      },
      {
        ruta: '/api/productos/eliminar/:idproducto',
        descripcion: 'Eliminar los productos',
        metodo: 'DELETE',
        parametros: 'idproducto'
      },
      {
        ruta: '/api/productos/buscarnombre/:nombreProducto',
        descripcion: 'Buscar productos por nombre',
        metodo: 'GET',
        parametros: 'nombreProducto'
      },
      {
        ruta: '/api/productos/metrics',
        descripcion: 'Obtiene métricas básicas (total, activos, sin stock, ventasHoy)',
        metodo: 'GET',
        parametros: 'ninguno'
      },
      {
        ruta: '/api/productos/cargarimagen',
        descripcion: 'Cargar imagen para un producto',
        metodo: 'POST',
        parametros: 'form-data: img, idproducto'
      }
    ]
  };

  MSJ('Peticion productos ejecutada correctamente', 200, moduloProductos, [], res);
};


exports.listarProductos = async (req, res) => {
  try {
    const productos = await Productos.find().sort({ createdAt: -1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.obteneProductoPorId = async (req, res) => {
  try {
    const productoID = req.params.idproducto;
    const producto = await Productos.findById(productoID);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.listarProductosPorNombre = async (req, res) => {
  try {
    const nombreProducto = req.params.nombreProducto;
    const productos = await Productos.find({
      nombreProducto: { $regex: `${nombreProducto}`, $options: 'i' }
    });

    if (!productos || productos.length === 0) {
      return res.status(404).json({ message: "No se encontraron productos" });
    }
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.guardarProducto = async (req, res) => {
  const producto = new Productos(req.body);
  try {
    const nuevoProducto = await producto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.editarProducto = async (req, res) => {
  try {
    const productoId = req.params.idproducto;
    const { cantidadEnStock } = req.body;


    const estado = cantidadEnStock === 0 ? 'Inactivo' : 'Activo';

    const productoActualizado = await Productos.findOneAndUpdate(
      { _id: productoId },
      { ...req.body, estado },
      { new: true }
    );

    if (!productoActualizado) {
      return res.status(404).json({ message: "Producto no encontrado para editar" });
    }
    res.json(productoActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.eliminarProducto = async (req, res) => {
  try {
    const productoId = req.params.idproducto;
  
    const productoBorrado = await Productos.findByIdAndDelete(productoId);

    if (!productoBorrado) {
      return res.status(404).json({ message: "Producto no encontrado para eliminar" });
    }
    res.json(productoBorrado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.obtenerMetrics = async (req, res) => {
  try {

    const totalProductos = await Productos.countDocuments();


    const activosCount = await Productos.countDocuments({ estado: 'Activo' });

  
    const sinStockCount = await Productos.countDocuments({ cantidadEnStock: 0 });


    const ventasHoy = 0;

    res.json({
      totalProductos,
      activosCount,
      sinStockCount,
      ventasHoy
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const uploads = multer({ dest: 'uploads/' });
exports.UploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Archivo no cargado' });
    }

    const { idproducto } = req.body;
    if (!idproducto) {
 
      unlinkSync(req.file.path);
      return res.status(400).json({ msg: 'Falta idproducto en el body' });
    }

   
    const cloudImageData = await cloudinary.uploader.upload(req.file.path, {
      folder: 'productos', 
      transformation: [{ width: 500, height: 500, crop: 'limit' }]
    });

 
    const cloudinaryUrl = cloudImageData.secure_url;


    unlinkSync(req.file.path);

 
    const actualizado = await Productos.findByIdAndUpdate(
      idproducto,
      { imagen: cloudinaryUrl },
      { new: true }
    );

    if (!actualizado) {
      return res.status(404).json({ msg: 'Producto no encontrado para asignar imagen' });
    }

    res.json({ imagenUrl: cloudinaryUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar la imagen' });
  }
};
