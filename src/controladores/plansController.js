const MSJ = require('../componentes/mensaje');
const Planes = require("../models/planesModels"); 

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
    const idPlan = req.params.idplan; 
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
        const nombrePlan = req.params.nombrePlan; 
       
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
    const { idplan } = req.params;
    const { nombrePlan, descripcion, precio, dias } = req.body;

    try {
        let plan = await Planes.findById(idplan);

        if (!plan) {
            return res.status(404).json({ message: 'Plan no encontrado' });
        }

        plan.nombrePlan = nombrePlan;
        plan.descripcion = descripcion;
        plan.precio = precio;
        plan.dias = dias;

        const planActualizado = await plan.save();

        res.json(planActualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.eliminarPlan = async (req, res) => {
    const { idplan } = req.params; 

    try {
     
        const planEliminado = await Planes.findByIdAndDelete(idplan);

        
        if (!planEliminado) {
            return res.status(404).json({ message: 'Plan no encontrado' });
        }

       
        res.json(planEliminado);
    } catch (error) {
      
        res.status(500).json({ message: error.message });
    }
};
