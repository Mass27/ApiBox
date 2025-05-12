const MSJ = require('../componentes/mensaje');
const Metricas = require('../models/metricasModels');

exports.Inicio = (req, res) => {
    const moduloMetricas = {
        modulo: 'metricas',
        descripcion: 'Contiene el registro y consulta de métricas físicas de los clientes',
        rutas: [
            {
                ruta: '/api/metricas/listar',
                descripcion: 'Lista todas las métricas',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/metricas/guardar',
                descripcion: 'Guarda una métrica nueva',
                metodo: 'POST',
                parametros: 'clienteId, pesoCorporal, grasaCorporal, imc, medidas, nota'
            },
            {
                ruta: '/api/metricas/cliente/:id',
                descripcion: 'Obtiene las métricas de un cliente por ID',
                metodo: 'GET',
                parametros: 'id del cliente'
            }
        ]
    };
    MSJ('Petición Métricas ejecutada correctamente', 200, moduloMetricas, [], res);
};

exports.listarMetricas = async (req, res) => {
    try {
        const metricas = await Metricas.find();
        res.json(metricas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// exports.listarMetricas = async (req, res) => {
//     try {
//         const metricas = await Metricas.find().populate('clienteId');
//         MSJ('Lista de métricas obtenida correctamente', 200, [], metricas, res);
//     } catch (error) {
//         MSJ('Error al obtener métricas', 500, error.message, [], res);
//     }
// };


exports.guardarMetrica = async (req, res) => {
    const metrica = new Metricas(req.body);

    try {
        const MetricaRutina = await metrica.save();
        res.status(201).json(MetricaRutina);
        res.json('Metrica Guardada correctamente');
    } catch (error) {
        console.error("❌ Error al guardar:", error);
        res.status(400).json({ message: error.message });
    }
};
// exports.guardarMetrica = async (req, res) => {
//     const datos = req.body;
//     const metrica = new Metricas(datos);

//     try {
//         // Guardamos la métrica
//         const nuevaMetrica = await metrica.save();

//         // Respuesta de éxito, asegurándonos de pasar la métrica bajo 'data'
//         MSJ('Métrica registrada correctamente', 201, [], nuevaMetrica, res);
//     } catch (error) {
//         // Respuesta de error, colocando el mensaje de error en 'errores'
//         MSJ('Error al guardar la métrica', 400, [error.message], [], res);
//     }
// };

exports.metricasPorCliente = async (req, res) => {
    const idCliente = req.params.id;

    try {
        const metricas = await Metricas.find({ clienteId: idCliente }).sort({ fecha: -1 });
        if (!metricas.length) {
            return res.status(404).json({ message: 'Metrica no encontrada' });
        } else {
            res.json(metricas);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
