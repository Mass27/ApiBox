const cron = require('node-cron');
const Clientes = require('../models/clientesModels');

const restarUnDiaAClientesActivos = async () => {
    try {
        const clientesActivos = await Clientes.find({ estado: { $in: ['Activo', 'Pendiente'] } });

        for (const cliente of clientesActivos) {
            cliente.diasRestantes = Math.max(cliente.diasRestantes - 1, 0);

            if (cliente.diasRestantes === 0) {
                cliente.estado = 'Inactivo';
            } else if (cliente.diasRestantes === 3) {
                cliente.estado = 'Pendiente';
            } else if (cliente.diasRestantes > 3) {
                cliente.estado = 'Activo';
            }

            await cliente.save();
        }

        console.log(`Actualización completa: ${clientesActivos.length} clientes procesados.`);
    } catch (error) {
        console.error(`Error al procesar clientes activos: ${error.message}`);
    }
};

// Ejecutar cada minuto para pruebas
cron.schedule('0 0 * * *', async () => {
    console.log('Ejecutando tarea CADA MINUTO para restar días y actualizar estado...');
    await restarUnDiaAClientesActivos();
});

module.exports = restarUnDiaAClientesActivos;
