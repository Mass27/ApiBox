const Clientes = require("../models/clientesModels");
const MSJ = require('../componentes/mensaje');
const multer = require('multer');
const { unlinkSync } = require('fs');
const cloudinary = require('cloudinary').v2; 
const moment = require('moment');
const mongoose = require('mongoose');
const Rutinas = require('../models/routinemodel');
const { ObjectId } = mongoose.Types;
const Planes = require('../models/planesModels'); 



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
  
        const clientesAct = await Clientes.find({ estado: 'Activo' });

 
        res.json(clientesAct);
    } catch (error) {
    
        res.status(500).json({ message: error.message });
    }
};
exports.contarClientesActivos = async (req, res) => {
    try {
       
        const cantidadClientesActivos = await Clientes.countDocuments({ estado: 'Activo' });

     
        res.json({ cantidadClientesActivos });
    } catch (error) {
       
        res.status(500).json({ message: error.message });
    }
};
exports.listarClientesPendientes = async (req, res) => {
    try {
     
        const clientesPendientes = await Clientes.find({ estado: 'Pendiente' });

       
        res.json(clientesPendientes);
    } catch (error) {
        // Si ocurre un error, manejarlo
        res.status(500).json({ message: error.message });
    }
};
exports.listarClientesInactivos = async (req, res) => {
    try {
       
        const clientesAct = await Clientes.find({ estado: 'Inactivo' });

       
        res.json(clientesAct);
    } catch (error) {
       
        res.status(500).json({ message: error.message });
    }
};
exports.buscarClientePorId = async (req, res) => {
    try {
        const clienteId = req.params.idCliente; 

 
        if (!ObjectId.isValid(clienteId)) {
            return res.status(400).json({ message: "ID de cliente no válido" });
        }

  
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
        const nombreCliente = req.params.nombreCliente; 

       
        const clientes = await Clientes.find({ nombreCompleto: { $regex: `${nombreCliente}`, $options: 'i' } });

        if (!clientes || clientes.length === 0) {
            return res.status(404).json({ message: "No se encontraron clientes con el nombre especificado" });
        }

        res.json(clientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.guardarCliente = async (req, res) => {
    const { imagen, nombreCompleto, identidad, numeroTelefono, correo, estado, idPlan, fechaIngreso } = req.body;

    try {
        const fechaIngresoCliente = fechaIngreso || new Date();

        let diasRestantes = 0;
        let nombrePlan = '';

        if (idPlan) {
            const plan = await Planes.findById(idPlan);
            if (!plan) {
                return res.status(404).json({ message: 'Plan no encontrado' });
            }
            diasRestantes = plan.dias || 0;
            nombrePlan = plan.nombre; 
        }

        const nuevoCliente = new Clientes({
            imagen,
            nombreCompleto,
            identidad,
            numeroTelefono,
            correo,
            estado,
            idPlan,
            nombrePlan, 
            diasRestantes,
            fechaIngreso: fechaIngresoCliente,
        });

        const clienteGuardado = await nuevoCliente.save();

        if (estado === 'Activo') {
            await restarUnDiaAClientesActivos();
        }

        res.status(201).json(clienteGuardado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const restarUnDiaAClientesActivos = async () => {
    try {
       
        const clientesActivos = await Clientes.find({ estado: 'Activo' });

      
        for (const cliente of clientesActivos) {
        
            cliente.diasRestantes = Math.max(cliente.diasRestantes - 1, 0);

        
            if (cliente.diasRestantes === 0) {
                cliente.estado = 'Inactivo';
            }

       
            await cliente.save();
        }
    } catch (error) {
        throw new Error(`Error al restar un día a los clientes activos: ${error.message}`);
    }
};

exports.editarCliente = async (req, res) => {
    const { idcliente } = req.params; 
    const { imagen, nombreCompleto, identidad, numeroTelefono, fechaIngreso, correo, estado, idPlan } = req.body;

    try {
        let cliente = await Clientes.findById(idcliente);

        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

  
        if (idPlan && idPlan !== cliente.idPlan.toString()) {
           
            const nuevoPlan = await Planes.findById(idPlan);
            
            if (!nuevoPlan) {
                return res.status(404).json({ message: 'Plan no encontrado' });
            }

    
            cliente.diasRestantes = nuevoPlan.dias || 0;  
            cliente.idPlan = idPlan;  
            cliente.nombrePlan = nuevoPlan.nombre;  

         
            await restarUnDiaAClientesActivos(); 
        }

   
        cliente.imagen = imagen;
        cliente.nombreCompleto = nombreCompleto;
        cliente.identidad = identidad;
        cliente.numeroTelefono = numeroTelefono;
        cliente.correo = correo;
        cliente.estado = estado;
        cliente.fechaIngreso = fechaIngreso;

       
        if (cliente.diasRestantes <= 0) {
            cliente.estado = 'Inactivo';
        }

    
        const clienteActualizado = await cliente.save();

        res.json(clienteActualizado);
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

        const { clienteId } = req.body;

   
        const cloudImageData = await cloudinary.uploader.upload(req.file.path, {
            transformation: [{ width: 500, height: 500, crop: 'limit' }]
        });

  
        const cloudinaryUrl = `https://res.cloudinary.com/dp8uoz27t/image/upload/v1689345253/${cloudImageData.public_id}.png`;

      
        unlinkSync(req.file.path);

      
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

        // Asignar la rutina al cliente (añadirla al arreglo)
        if (!cliente.rutinasAsignadas.includes(rutinaId)) {
            cliente.rutinasAsignadas.push(rutinaId);  // Añadir rutina al arreglo
            await cliente.save();
        }

        res.status(200).json({ message: 'Rutina asignada correctamente', cliente });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al asignar rutina', error });
    }
};


exports.obtenerRutinasAsignadas = async (req, res) => {
    const { clienteId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(clienteId)) {
        return res.status(400).json({ message: 'Cliente ID no válido' });
    }

    try {
        const cliente = await Clientes.findById(clienteId).populate('rutinasAsignadas');
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.status(200).json({ rutinasAsignadas: cliente.rutinasAsignadas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener rutinas asignadas', error });
    }
};

exports.eliminarRutina = async (req, res) => {
    const { clienteId, rutinaId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(clienteId) || !mongoose.Types.ObjectId.isValid(rutinaId)) {
      return res.status(400).json({ message: 'Cliente ID o Rutina ID no válido' });
    }
  
    try {
      const cliente = await Clientes.findById(clienteId);
      if (!cliente) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }
  
      // Eliminar la rutina de las rutinas asignadas
      cliente.rutinasAsignadas = cliente.rutinasAsignadas.filter(rutina => rutina.toString() !== rutinaId);
      await cliente.save();
  
      res.status(200).json({ message: 'Rutina eliminada correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar rutina', error });
    }
  };