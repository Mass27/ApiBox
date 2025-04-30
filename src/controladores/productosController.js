const Productos = require("../models/productosModels"); // Asegúrate de proporcionar la ruta correcta
const MSJ = require('../componentes/mensaje');
const multer = require('multer');
const { unlinkSync } = require('fs');
const cloudinary = require('cloudinary').v2;


exports.Inicio = (req, res)=>{
    const moduloProductos={
        modulo: 'productos',
        descripcion: 'Contiene la informacion de los productos',
        rutas:[
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
                ruta: '/api/productos/editar',
                descripcion: 'Modifica los productos',
                metodo: 'PUT',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/productos/eliminar',
                descripcion: 'Eliminar los productos',
                metodo: 'DELETE',
                parametros: 'ninguno'
            }
        ]
    } 
    MSJ('Peticion productos ejecutada correctamente',  200, moduloProductos, [], res);
}

// Controlador para listar todos los producto
exports.listarProductos = async (req, res) => {
    try {
        const productos = await Productos.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.obteneProductoPorId = async (req, res) => {
    try {
        const productoID = req.params.idproducto; // Asegúrate de tener el ID proporcionado en la URL

        // Utiliza findById para buscar un producto por su ID
        const producto = await Productos.findOne({idproducto: productoID});

        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json(producto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Controlador para obtener un producto por su ID
exports.listarProductosPorNombre = async (req, res) => {
    try {
        const nombreProducto = req.params.nombreProducto; // Obtén el nombre del producto de los parámetros de la URL

        // Utiliza find para buscar productos cuyo nombre contenga la palabra proporcionada
        const productos = await Productos.find({ nombreProducto: { $regex: `${nombreProducto}`, $options: 'i' } });

        if (!productos || productos.length === 0) {
            return res.status(404).json({ message: "No se encontraron productos con el nombre especificado" });
        }

        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para guardar un nuevo producto
exports.guardarProducto = async (req, res) => {
    const producto = new Productos(req.body);

    try {
        const nuevoProdcuto = await producto.save();
        res.status(201).json(nuevoProdcuto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controlador para editar un producto por su ID
exports.editarProducto = async (req, res) => {
    try {
        const productoId = req.params.idproducto;
        const producto = await Productos.findOneAndUpdate({idproducto: productoId}, req.body, { new: true });
        res.json(producto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controlador para eliminar un producto por su ID
exports.eliminarProducto = async (req, res) => {
    try {
        const productoId = req.params.idproducto;
        const producto = await Productos.findOneAndDelete({idproducto: productoId},);
        res.json(producto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const uploads = multer({ dest: 'uploads/' });
exports.UploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'Archivo no cargado' });
        }

        const { idproducto } = req.body;

        // Sube la imagen a Cloudinary
        const cloudImageData = await cloudinary.uploader.upload(req.file.path, {
            transformation: [{ width: 500, height: 500, crop: 'limit' }]
        });

        // Construye la URL de la imagen en Cloudinary
        const cloudinaryUrl = `https://res.cloudinary.com/dp8uoz27t/image/upload/v1689345253/${cloudImageData.public_id}.png`;

        // Elimina el archivo temporal
        unlinkSync(req.file.path);

        // Actualiza el documento del producto en la base de datos MongoDB con la URL de la imagen
        await Productos.updateOne({ idproducto: idproducto }, { imagen: cloudinaryUrl });    

        res.json({ cloudinaryUrl });    
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cargar la imagen' });
    }
};