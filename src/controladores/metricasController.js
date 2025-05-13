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
        const metricas = await Metricas.find({ esHistorial: false });
        res.json(metricas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// exports.guardarMetrica = async (req, res) => {
//     const metrica = new Metricas(req.body); 

//     try {
//         const MetricaRutina = await metrica.save();
//         res.status(201).json(MetricaRutina);
//     } catch (error) {
//         console.error("❌ Error al guardar:", error);
//         res.status(400).json({ message: error.message });
//     }
// };

exports.guardarMetrica = async (req, res) => {
  const { clienteId } = req.body;
  if (!clienteId) return res.status(400).json({ message: 'clienteId requerido' });

  try {
    // 1. Buscar la métrica actual del cliente (si existe)
    const metricaActual = await Metricas.findOne({ clienteId, esHistorial: false });

    // 2. Si existe, pasarla a historial
    if (metricaActual) {
      metricaActual.esHistorial = true;
      await metricaActual.save();
    }

    // 3. Guardar la nueva como “actual”
    const nuevaMetrica = new Metricas({ ...req.body, esHistorial: false });
    const resultado = await nuevaMetrica.save();

    res.status(201).json(resultado);
  } catch (error) {
    console.error('❌ Error al guardar:', error);
    res.status(500).json({ message: error.message });
  }
};
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
exports.buscarMetricaPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const metrica = await Metricas.findById(id).populate('clienteId');

        if (!metrica) {
            return res.status(404).json({
                msj: 'Métrica no encontrada',
                data: [],
                errores: []
            });
        }

        res.status(200).json({
            msj: 'Métrica encontrada correctamente',
            data: metrica,
            errores: []
        });
    } catch (error) {
        console.error("❌ Error al buscar métrica:", error);
        res.status(500).json({
            msj: 'Error al buscar la métrica',
            data: [],
            errores: [error.message]
        });
    }

}

// exports.editarMetricaPorId = async (req, res) => {
//     const { id } = req.params;
//     const nuevosDatos = req.body;

//     try {
//         const metricaActualizada = await Metricas.findByIdAndUpdate(id, nuevosDatos, {
//             new: true,        
//             runValidators: true 
//         });

//         if (!metricaActualizada) {
//             return res.status(404).json({
//                 msj: 'Métrica no encontrada',
//                 data: [],
//                 errores: []
//             });
//         }

//         res.status(200).json({
//             msj: 'Métrica actualizada correctamente',
//             data: metricaActualizada,
//             errores: []
//         });
//     } catch (error) {
//         console.error("❌ Error al editar métrica:", error);
//         res.status(500).json({
//             msj: 'Error al editar la métrica',
//             data: [],
//             errores: [error.message]
//         });
//     }
// };
exports.editarMetricaPorId = async (req, res) => {
  const { id } = req.params;
    if (!id || id === 'undefined') {
    return res.status(400).json({
      msj: 'ID de la métrica no proporcionado o inválido',
      data: [],
      errores: ['El parámetro :id es obligatorio en la URL']
    });
  }

  const nuevosDatos = req.body;

  try {
    // Verificar si se está intentando guardar como esHistorial: false
    if (nuevosDatos.esHistorial === false) {
      // Obtener la métrica actual
      const metricaActual = await Metricas.findById(id);

      // Si se intenta cambiar a esHistorial: false y no lo era antes
      if (metricaActual && metricaActual.esHistorial === true) {
        const yaExiste = await Metricas.findOne({
          clienteId: metricaActual.clienteId,
          esHistorial: false,
          _id: { $ne: id } // excluir la métrica actual
        });

        if (yaExiste) {
          return res.status(400).json({
            msj: 'El cliente ya tiene una métrica principal. Solo se permite una con esHistorial: false.',
            data: [],
            errores: []
          });
        }
      }
    }

    // Actualizar la métrica
    const metricaActualizada = await Metricas.findByIdAndUpdate(id, nuevosDatos, {
      new: true,
      runValidators: true
    });

    if (!metricaActualizada) {
      return res.status(404).json({
        msj: 'Métrica no encontrada',
        data: [],
        errores: []
      });
    }

    res.status(200).json({
      msj: 'Métrica actualizada correctamente',
      data: metricaActualizada,
      errores: []
    });

  } catch (error) {
    console.error("❌ Error al editar métrica:", error);
    res.status(500).json({
      msj: 'Error al editar la métrica',
      data: [],
      errores: [error.message]
    });
  }
};
