const Clientes = require("../models/clientesModels"); // Asegúrate de proporcionar la ruta correcta
const MSJ = require('../componentes/mensaje');
const multer = require('multer');
const { unlinkSync } = require('fs');
const cloudinary = require('cloudinary').v2; // Importa la instancia de Cloudinary
const moment = require('moment');
const mongoose = require('mongoose');
const Rutinas = require('../models/routinemodel');
const { ObjectId } = mongoose.Types;


exports.Inicio = (req, res)=>{
    const moduloClientes={
        modulo: 'clientes',
        descripcion: 'Contiene la informacion de los clientes',
        rutas:[
            {
                ruta: '/api/clientes/listar',
                descripcion: 'Lista los clientes',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/clientes/buscar',
                descripcion: 'Buscar los clientes',
                metodo: 'POST',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/clientes/guardar',
                descripcion: 'Guarda los clientes',
                metodo: 'POST',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/clientes/editar',
                descripcion: 'Modifica los clientes',
                metodo: 'PUT',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/clientes/eliminar',
                descripcion: 'Eliminar los clientes',
                metodo: 'DELETE',
                parametros: 'ninguno'
            }
        ]
    } 
    MSJ('Peticion Clientes ejecutada correctamente',  200, moduloClientes, [], res);
}

// Controlador para listar todos los clientes
exports.listarClientes = async (req, res) => {
    try {
        const clientes = await Clientes.find();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.listarClientesActivos = async (req, res) => {
    try {
        // Buscar los clientes con estado "Activo"
        const clientesAct = await Clientes.find({ estado: 'Activo' });

        // Retornar los clientes activos como respuesta
        res.json(clientesAct);
    } catch (error) {
        // Si ocurre un error, manejarlo
        res.status(500).json({ message: error.message });
    }
};
exports.contarClientesActivos = async (req, res) => {
    try {
        // Contar los clientes con estado "Activo"
        const cantidadClientesActivos = await Clientes.countDocuments({ estado: 'Activo' });

        // Retornar la cantidad de clientes activos como respuesta
        res.json({ cantidadClientesActivos });
    } catch (error) {
        // Si ocurre un error, manejarlo
        res.status(500).json({ message: error.message });
    }
};
exports.listarClientesPendientes = async (req, res) => {
    try {
        // Buscar los clientes con estado "Pendiente"
        const clientesPendientes = await Clientes.find({ estado: 'Pendiente' });

        // Retornar los clientes pendientes como respuesta
        res.json(clientesPendientes);
    } catch (error) {
        // Si ocurre un error, manejarlo
        res.status(500).json({ message: error.message });
    }
};
exports.listarClientesInactivos = async (req, res) => {
    try {
        // Buscar los clientes con estado "Inactivo"
        const clientesAct = await Clientes.find({ estado: 'Inactivo' });

        // Retornar los clientes activos como respuesta
        res.json(clientesAct);
    } catch (error) {
        // Si ocurre un error, manejarlo
        res.status(500).json({ message: error.message });
    }
};
exports.buscarClientePorId = async (req, res) => {
    try {
        const clienteId = req.params.idCliente; // Obtén el ID del cliente de los parámetros de la URL

        // Verifica si el ID es válido antes de realizar la búsqueda
        if (!ObjectId.isValid(clienteId)) {
            return res.status(400).json({ message: "ID de cliente no válido" });
        }

        // Utiliza findById para buscar un cliente por su ID
        const cliente = await Clientes.findById(clienteId);

        if (!cliente) {
            return res.status(404).json({ message: "No se encontró cliente con el ID especificado" });
        }

        res.json(cliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Controlador para obtener un cliente por su ID
exports.listarClientesPorNombre = async (req, res) => {
    try {
        const nombreCliente = req.params.nombreCliente; // Obtén el nombre del cliente de los parámetros de la URL

        // Utiliza find para buscar clientes cuyo nombre contenga la palabra proporcionada
        const clientes = await Clientes.find({ nombreCompleto: { $regex: `${nombreCliente}`, $options: 'i' } });

        if (!clientes || clientes.length === 0) {
            return res.status(404).json({ message: "No se encontraron clientes con el nombre especificado" });
        }

        res.json(clientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Controlador para guardar un nuevo cliente
exports.guardarCliente = async (req, res) => {
    const { imagen, nombreCompleto, identidad, numeroTelefono, correo, estado, idPlan, fechaIngreso } = req.body;

    try {
        // Utiliza la fecha actual como valor predeterminado si no se proporciona una fecha de ingreso específica
        const fechaIngresoCliente = fechaIngreso || new Date();

        // Establece díasRestantes en 30 si se proporciona un idPlan
        const diasRestantes = idPlan ? 30 : 0;

        // Crear un nuevo objeto de cliente con los datos proporcionados
        const nuevoCliente = new Clientes({
            imagen,
            nombreCompleto,
            identidad,
            numeroTelefono,
            correo,
            estado,
            idPlan,
            diasRestantes,
            fechaIngreso: fechaIngresoCliente,
        });

        // Guardar el cliente en la base de datos
        const clienteGuardado = await nuevoCliente.save();

        //Lógica para restar un día a los clientes con estado 'Activo'
        if (estado === 'Activo') {
            await restarUnDiaAClientesActivos();
        }

        // Retorna el cliente guardado como respuesta
        res.status(201).json(clienteGuardado);
    } catch (error) {
        // Si ocurre un error, maneja la excepción
        res.status(500).json({ message: error.message });
    }
};
const restarUnDiaAClientesActivos = async () => {
    try {
        const clientesActivos = await Clientes.find({ estado: 'Activo' });

        for (const cliente of clientesActivos) {
            cliente.diasRestantes = Math.max(cliente.diasRestantes - 1, 0);
            await cliente.save();
        }
    } catch (error) {
        throw new Error(`Error al restar un día a los clientes activos: ${error.message}`);
    }
};

// Controlador para editar un cliente por su ID
exports.editarCliente = async (req, res) => {
    const { idcliente } = req.params; // Obtener el ID del cliente de los parámetros de la URL
    const { imagen, nombreCompleto, identidad, numeroTelefono, fechaIngreso, correo, estado, idPlan } = req.body;

    try {
        // Buscar el cliente por su ID
        let cliente = await Clientes.findById(idcliente);

        // Verificar si el cliente existe
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        // Actualizar los campos del cliente con los nuevos valores
        cliente.imagen = imagen;
        cliente.nombreCompleto = nombreCompleto;
        cliente.identidad = identidad;
        cliente.numeroTelefono = numeroTelefono;
        cliente.correo = correo;
        cliente.estado = estado;
        cliente.fechaIngreso= fechaIngreso;
        cliente.idPlan = idPlan;

        // Guardar los cambios en el cliente
        const clienteActualizado = await cliente.save();

        // Retornar el cliente actualizado como respuesta
        res.json(clienteActualizado);
    } catch (error) {
        // Si ocurre un error, manejarlo
        res.status(500).json({ message: error.message });
    }
};

const uploads = multer({ dest: 'uploads/' });
exports.UploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'Archivo no cargado' });
        }

        const { clienteId } = req.body;

        // Sube la imagen a Cloudinary
        const cloudImageData = await cloudinary.uploader.upload(req.file.path, {
            transformation: [{ width: 500, height: 500, crop: 'limit' }]
        });

        // Construye la URL de la imagen en Cloudinary
        const cloudinaryUrl = `https://res.cloudinary.com/dp8uoz27t/image/upload/v1689345253/${cloudImageData.public_id}.png`;

        // Elimina el archivo temporal
        unlinkSync(req.file.path);

        // Actualiza el documento del cliente en la base de datos MongoDB con la URL de la imagen
        await Clientes.updateOne({ _id: clienteId }, { imagen: cloudinaryUrl });    

        res.json({ cloudinaryUrl });    
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cargar la imagen' });
    }
};

// Controlador para eliminar un cliente por su ID
exports.eliminarCliente = async (req, res) => {
    const { idcliente } = req.params; // Obtener el ID del cliente de los parámetros de la URL

    try {
        // Buscar el cliente por su ID
        let cliente = await Clientes.findById(idcliente);

        // Verificar si el cliente existe
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        // Cambiar el estado del cliente a "Inactivo"
        cliente.estado = 'Inactivo';

        // Guardar los cambios en el cliente
        const clienteActualizado = await cliente.save();

        // Retornar el cliente actualizado como respuesta
        res.json(clienteActualizado);
    } catch (error) {
        // Si ocurre un error, manejarlo
        res.status(500).json({ message: error.message });
    }
};
exports.asignarRutinaACliente = async (req, res) => {
    const { clienteId, rutinaId } = req.body;

    // Verificar que el clienteId es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(clienteId)) {
        return res.status(400).json({ message: 'Cliente ID no válido' });
    }

    try {
        // Verificar que el cliente existe
        const cliente = await Clientes.findById(clienteId);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        // Verificar que la rutina existe
        const rutina = await Rutinas.findById(rutinaId);
        if (!rutina) {
            return res.status(404).json({ message: 'Rutina no encontrada' });
        }

        // Asignar la rutina al cliente
        cliente.rutina = rutinaId; // O lo que sea adecuado según tu estructura
        await cliente.save();

        res.status(200).json({ message: 'Rutina asignada correctamente', cliente });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al asignar rutina', error });
    }
};
