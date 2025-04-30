const MSJ = require('../componentes/mensaje');
const Planes = require("../models/planesModels"); // Asegúrate de proporcionar la ruta correcta

exports.Inicio = (req, res)=>{
    const moduloPlanes={
        modulo: 'planes',
        descripcion: 'Contiene la informacion de los planes',
        rutas:[
            {
                ruta: '/api/planes/listar',
                descripcion: 'Lista los planes',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/planes/guardar',
                descripcion: 'Guarda los planes',
                metodo: 'POST',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/planes/editar',
                descripcion: 'Modifica los planes',
                metodo: 'PUT',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/planes/eliminar',
                descripcion: 'Eliminar los planes',
                metodo: 'DELETE',
                parametros: 'ninguno'
            }
        ]
    } 
    MSJ('Peticion Planes ejecutada correctamente',  200, moduloPlanes, [], res);
}

exports.listarPlanes = async (req, res) => {
    try {
        const planes = await Planes.find();
        res.json(planes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.buscarPlanPorId = async (req, res) => {
    const idPlan = req.params.idplan; // Asegúrate de que el parámetro coincida con el nombre en la ruta
    try {
        const plan = await Planes.findById(idPlan);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.buscarPlanPorNombre = async (req, res) => {
    try {
        const nombrePlan = req.params.nombrePlan; // Obtén el nombre del plan de los parámetros de la URL

        // Utiliza find para buscar planes cuyo nombrePlan contenga la palabra proporcionada
        const planes = await Planes.find({ nombrePlan: { $regex: `${nombrePlan}`, $options: 'i' } });

        if (!planes || planes.length === 0) {
            return res.status(404).json({ message: 'No se encontraron planes con el nombre especificado' });
        }

        res.json(planes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.guardarPlanes = async (req, res) => {
    const plan = new Planes(req.body);

    try {
        const nuevoPlan = await plan.save();
        res.status(201).json(nuevoPlan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.editarPlan = async (req, res) => {
    const { idplan } = req.params; // Obtener el ID del plan de los parámetros de la URL
    const { nombrePlan, descripcion, precio } = req.body;

    try {
        // Buscar el plan por su ID
        let plan = await Planes.findById(idplan);

        // Verificar si el plan existe
        if (!plan) {
            return res.status(404).json({ message: 'Plan no encontrado' });
        }

        // Actualizar los campos del plan con los nuevos valores
        plan.nombrePlan = nombrePlan;
        plan.descripcion = descripcion;
        plan.precio = precio;

        // Guardar los cambios en el plan
        const planActualizado = await plan.save();

        // Retornar el plan actualizado como respuesta
        res.json(planActualizado);
    } catch (error) {
        // Si ocurre un error, manejarlo
        res.status(500).json({ message: error.message });
    }
};


// Controlador para eliminar un empleado por su ID
exports.eliminarPlan = async (req, res) => {
    const { idplan } = req.params; // Obtener el ID del plan de los parámetros de la URL

    try {
        // Buscar el plan por su ID y eliminarlo
        const planEliminado = await Planes.findByIdAndDelete(idplan);

        // Verificar si el plan fue encontrado y eliminado
        if (!planEliminado) {
            return res.status(404).json({ message: 'Plan no encontrado' });
        }

        // Retornar el plan eliminado como respuesta
        res.json(planEliminado);
    } catch (error) {
        // Si ocurre un error, manejarlo
        res.status(500).json({ message: error.message });
    }
};
