const Facturaciones = require("../models/facturacionModels"); // Asegúrate de proporcionar la ruta correcta
const MSJ = require('../componentes/mensaje');

exports.Inicio = (req, res)=>{
    const moduloFacturaciones={
        modulo: 'facturaciones',
        descripcion: 'Contiene la informacion de las facturas',
        rutas:[
            {
                ruta: '/api/facturacion/listar',
                descripcion: 'Lista las facturacion',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/facturacion/guardar',
                descripcion: 'Guarda las facturacion',
                metodo: 'POST',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/facturacion/editar',
                descripcion: 'Modifica las facturacion',
                metodo: 'PUT',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/facturacion/eliminar',
                descripcion: 'Eliminar las facturacion',
                metodo: 'DELETE',
                parametros: 'ninguno'
            }
        ]
    } 
    MSJ('Peticion Facturaciones ejecutada correctamente',  200, moduloFacturaciones, [], res);
}

exports.listarFacturas = async (req, res) => {
    try {
        const facturas = await Facturaciones.find();
        res.json(facturas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.obtenerFacturaPorId = async (req, res) => {
    try {
        const facturaId = req.params.idfacturacion; // Obtén el ID de la factura de los parámetros de la URL

        // Utiliza findById para buscar una factura por su ID
        const facturacion = await Facturaciones.findById(facturaId);

        if (!facturacion) {
            return res.status(404).json({ message: "Facturacion no encontrada" });
        }

        res.json(facturacion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener una factura por su ID
exports.obtenerFacturaPorNombreCliente = async (req, res) => {
    try {
        const nombreCliente = req.params.nombreCliente; // Obtén el nombre del cliente de los parámetros de la URL

        // Utiliza findOne para buscar una factura por el nombre del cliente que contenga la palabra
        const facturacion = await Facturaciones.find({ nombreCliente: { $regex: `${nombreCliente}`, $options: 'i' } });

        if (!facturacion || facturacion.length === 0) {
            return res.status(404).json({ message: "No se encontraron facturas para el cliente especificado" });
        }

        res.json(facturacion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.guardarFacturacion = async (req, res) => {
    const {
        idcliente,
        nombreCliente,
        fecha,
        metodoPago,
        idPlan,
        nombrePlan,
        precioPlan,
        idproducto,
        nombreProducto,
        precioProducto,
        CantidadProducto,
        subtotal,
        descuento,
        totalPagar
    } = req.body;

    try {
        // Crear un nuevo objeto de factura con los datos proporcionados
        const nuevaFactura = new Facturaciones({
            idcliente,
            nombreCliente,
            fecha,
            metodoPago,
            idPlan,
            nombrePlan,
            precioPlan,
            idproducto,
            nombreProducto,
            precioProducto,
            CantidadProducto,
            subtotal,
            descuento,
            totalPagar
        });

        // Guardar la factura en la base de datos
        const facturaGuardada = await nuevaFactura.save();

        // Retornar la factura guardada como respuesta
        res.status(201).json(facturaGuardada);
    } catch (error) {
        // Si ocurre un error, manejar la excepción
        res.status(500).json({ message: error.message });
    }
};

exports.editarFacturacion = async (req, res) => {
    try {
        const facturaId = req.params.idfacturacion; // Obtén el ID de la factura de los parámetros de la URL
        const {
            idcliente,
            nombreCliente,
            fecha,
            metodoPago,
            idPlan,
            nombrePlan,
            precioPlan,
            idproducto,
            nombreProducto,
            precioProducto,
            CantidadProducto,
            subtotal,
            descuento,
            totalPagar
        } = req.body;

        // Verificar si la factura existe
        let factura = await Facturaciones.findById(facturaId);

        if (!factura) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }

        // Actualizar los campos de la factura con los nuevos valores
        factura.idcliente = idcliente;
        factura.nombreCliente = nombreCliente;
        factura.fecha = fecha;
        factura.metodoPago = metodoPago;
        factura.idPlan = idPlan;
        factura.nombrePlan = nombrePlan;
        factura.precioPlan = precioPlan;
        factura.idproducto = idproducto;
        factura.nombreProducto = nombreProducto;
        factura.precioProducto = precioProducto;
        factura.CantidadProducto = CantidadProducto;
        factura.subtotal = subtotal;
        factura.descuento = descuento;
        factura.totalPagar = totalPagar;

        // Guardar los cambios en la factura
        const facturaActualizada = await factura.save();

        // Retornar la factura actualizada como respuesta
        res.json(facturaActualizada);
    } catch (error) {
        // Si ocurre un error, manejarlo
        res.status(500).json({ message: error.message });
    }
};


// Controlador para eliminar un factura por su ID
exports.eliminarFacturacion = async (req, res) => {
    try {
        await Facturaciones.findByIdAndDelete(req.params.id);
        res.json({ message: "Factura eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
