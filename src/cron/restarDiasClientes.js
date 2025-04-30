const cron = require('node-cron');
const Clientes = require('../models/clientesModels');

// Función para restar un día a los clientes activos
const restarUnDiaAClientesActivos = async () => {
    try {
        const clientesActivos = await Clientes.find({ estado: 'Activo' });

        for (const cliente of clientesActivos) {
            cliente.diasRestantes = Math.max(cliente.diasRestantes - 1, 0);
            await cliente.save();
        }

        console.log(`Días restantes actualizados para ${clientesActivos.length} clientes activos.`);
    } catch (error) {
        console.error(`Error al restar un día a los clientes activos: ${error.message}`);
    }
};

// Programar la tarea para que se ejecute todos los días a medianoche
cron.schedule('0 0 * * *', async () => {
    console.log('Ejecutando tarea diaria para restar días a clientes activos...');
    await restarUnDiaAClientesActivos();
});

module.exports = restarUnDiaAClientesActivos;