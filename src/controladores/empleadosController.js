const Empleados = require("../models/empleadosModels"); 
const MSJ = require('../componentes/mensaje');
const multer = require('multer');
const { unlinkSync } = require('fs');
const cloudinary = require('cloudinary').v2; 

exports.Inicio = (req, res)=>{
    const moduloEmpleados={
        modulo: 'empleados',
        descripcion: 'Contiene la informacion de los empleados',
        rutas:[
            {
                ruta: '/api/empleados/listar',
                descripcion: 'Lista los empleados',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/empleados/buscar',
                descripcion: 'Buscar los empleados',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/empleados/guardar',
                descripcion: 'Guarda los empleados',
                metodo: 'POST',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/empleados/editar',
                descripcion: 'Modifica los empleados',
                metodo: 'PUT',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/empleados/eliminar',
                descripcion: 'Eliminar los empleados',
                metodo: 'DELETE',
                parametros: 'ninguno'
            }
        ]
    } 
    MSJ('Peticion Empleados ejecutada correctamente',  200, moduloEmpleados, [], res);
}


exports.listarEmpleados = async (req, res) => {
    try {
        const empleados = await Empleados.find();
        res.json(empleados);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.obtenerEmpleadoPorId = async (req, res) => {
    try {
        const empleadoId = req.params.idempleado; 

    
        const empleado = await Empleados.findOne({idempleado: empleadoId});

        if (!empleado) {
            return res.status(404).json({ message: "Empleado no encontrado" });
        }

        res.json(empleado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.obtenerEmpleadoPorNombre = async (req, res) => {
    try {
        const nombreCompleto = req.params.nombreCompleto; 

   
        const empleados = await Empleados.find({ nombreCompleto: { $regex: `${nombreCompleto}`, $options: 'i' } });

        if (!empleados || empleados.length === 0) {
            return res.status(404).json({ message: "No se encontraron empleados con el nombre especificado" });
        }

        res.json(empleados);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.guardarEmpleado = async (req, res) => {
    const empleado = new Empleados(req.body);
if (!req.body.tipoEmpleado || req.body.tipoEmpleado.trim() === "") {
    return res.status(400).json({ message: "El tipo de empleado es obligatorio." });
}
    try {
        const nuevoEmpleado = await empleado.save();
        res.status(201).json(nuevoEmpleado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.editarEmpleado = async (req, res) => {
    try {
        const empleadoId = req.params.idempleado;
        const empleado = await Empleados.findOneAndUpdate({idempleado: empleadoId}, req.body, { new: true });
        res.json(empleado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.eliminarEmpleado = async (req, res) => {
    try {
        const empleadoId = req.params.idempleado;
        const empleado = await Empleados.findOneAndDelete({idempleado: empleadoId});
        res.json(empleado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.listarEntrenadores = async (req, res) => {
    try {
        const entrenadores = await Empleados.find({ tipoEmpleado: 'entrenador' });
        res.json(entrenadores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};