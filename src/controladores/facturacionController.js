const Facturaciones = require("../models/facturacionModels"); 
const MSJ = require('../componentes/mensaje');
const Productos = require("../models/productosModels");

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
        const facturaId = req.params.idfacturacion; 

     
        const facturacion = await Facturaciones.findById(facturaId);

        if (!facturacion) {
            return res.status(404).json({ message: "Facturacion no encontrada" });
        }

        res.json(facturacion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.obtenerFacturaPorNombreCliente = async (req, res) => {
    try {
        const nombreCliente = req.params.nombreCliente; 


        const facturacion = await Facturaciones.find({ nombreCliente: { $regex: `${nombreCliente}`, $options: 'i' } });

        if (!facturacion || facturacion.length === 0) {
            return res.status(404).json({ message: "No se encontraron facturas para el cliente especificado" });
        }

        res.json(facturacion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// exports.guardarFacturacion = async (req, res) => {
//     const {
//         idcliente,
//         nombreCliente,
//         fecha,
//         metodoPago,
//         idPlan,
//         nombrePlan,
//         precioPlan,
//         idproducto,
//         nombreProducto,
//         precioProducto,
//         CantidadProducto,
//         subtotal,
//         descuento,
//         totalPagar
//     } = req.body;

//     try {
       
//         const nuevaFactura = new Facturaciones({
//             idcliente,
//             nombreCliente,
//             fecha,
//             metodoPago,
//             idPlan,
//             nombrePlan,
//             precioPlan,
//             idproducto,
//             nombreProducto,
//             precioProducto,
//             CantidadProducto,
//             subtotal,
//             descuento,
//             totalPagar
//         });

//         const facturaGuardada = await nuevaFactura.save();

     
//         res.status(201).json(facturaGuardada);
//     } catch (error) {
      
//         res.status(500).json({ message: error.message });
//     }
// };



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
        // Validar producto por ObjectId
        const producto = await Productos.findById(idproducto);
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        if (producto.cantidadEnStock < CantidadProducto) {
            return res.status(400).json({ message: "Stock insuficiente" });
        }

        // Crear factura
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

        await nuevaFactura.save();

        // Actualizar stock
        producto.cantidadEnStock -= CantidadProducto;
        await producto.save();

        res.status(201).json(nuevaFactura);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.editarFacturacion = async (req, res) => {
    try {
        const facturaId = req.params.idfacturacion; 
        
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

       
        let factura = await Facturaciones.findById(facturaId);

        if (!factura) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }

       
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

        
        const facturaActualizada = await factura.save();

      
        res.json(facturaActualizada);
    } catch (error) {
      
        res.status(500).json({ message: error.message });
    }
};



exports.eliminarFacturacion = async (req, res) => {
    try {
        await Facturaciones.findByIdAndDelete(req.params.id);
        res.json({ message: "Factura eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
