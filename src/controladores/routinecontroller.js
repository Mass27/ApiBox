const Rutinas = require("../models/routinemodel"); // Asegúrate de proporcionar la ruta correcta
const MSJ = require('../componentes/mensaje');
const multer = require('multer');
const { unlinkSync } = require('fs');
const cloudinary = require('cloudinary').v2; // Importa la instancia de Cloudinary

// Controlador para la sección de Rutinas
exports.Inicio = (req, res) => {
    const moduloRutinas = {
        modulo: 'rutinas',
        descripcion: 'Contiene la informacion de las rutinas asignadas a los empleados',
        rutas: [
            {
                ruta: '/api/rutinas/listar',
                descripcion: 'Lista las rutinas',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/rutinas/guardar',
                descripcion: 'Guarda una nueva rutina',
                metodo: 'POST',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/rutinas/editar',
                descripcion: 'Modifica una rutina',
                metodo: 'PUT',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/rutinas/eliminar',
                descripcion: 'Eliminar una rutina',
                metodo: 'DELETE',
                parametros: 'ninguno'
            }
        ]
    }
    MSJ('Peticion Rutinas ejecutada correctamente', 200, moduloRutinas, [], res);
}

// Controlador para listar todas las rutinas
exports.listarRutinas = async (req, res) => {
    try {
        const rutinas = await Rutinas.find();
        res.json(rutinas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener una rutina por su ID
exports.obtenerRutinaPorId = async (req, res) => {
    try {
        const rutinaId = req.params.idrutina;

        const rutina = await Rutinas.findById(rutinaId); // <- usa findById si el ID es el _id de Mongo

        if (!rutina) {
            return res.status(404).json({ message: "Rutina no encontrada" });
        }

        res.json(rutina);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para guardar una nueva rutina
exports.guardarRutina = async (req, res) => {
    const rutina = new Rutinas(req.body);

    try {
        const nuevaRutina = await rutina.save();
        res.status(201).json(nuevaRutina);
    } catch (error) {
        console.error("❌ Error al guardar:", error);
        res.status(400).json({ message: error.message });
    }
};

// Controlador para editar una rutina por su ID
exports.editarRutina = async (req, res) => {
    try {
        const rutinaId = req.params.idrutina;
        const rutina = await Rutinas.findByIdAndUpdate(rutinaId, req.body, { new: true });
        res.json(rutina);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controlador para eliminar una rutina por su ID
exports.eliminarRutina = async (req, res) => {
    try {
        const rutinaId = req.params.idrutina;
        const rutina = await Rutinas.findOneAndDelete(rutinaId, req.body, { new: true });
        res.json('rutina eliminada correctamente');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.buscarRutinaPorNombre = async (req, res) => {
    try {
        const nombre = req.params.nombre;

        const rutina = await Rutinas.find({ nombre: { $regex: new RegExp(nombre, "i") } });

        if (!rutina) {
            return res.status(404).json({ message: 'Rutina no encontrada' });
        }

        res.json(rutina);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};