const Facturaciones = require("../models/facturacionModels"); 
const MSJ = require('../componentes/mensaje');
const Productos = require("../models/productosModels");
const Planes = require('../models/planesModels');
const nodemailer = require('nodemailer');
const Handlebars = require('handlebars');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

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
    if (idproducto) {
      const producto = await Productos.findById(idproducto);
      if (!producto) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      if (producto.cantidadEnStock < CantidadProducto) {
        return res.status(400).json({ message: "Stock insuficiente" });
      }

     
      producto.cantidadEnStock -= CantidadProducto;

  
      if (producto.cantidadEnStock === 0) {
        producto.estado = 'Inactivo';  
      }

      await producto.save();  
    }

   
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

    res.status(201).json(nuevaFactura);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.editarFacturacion = async (req, res) => {
    try {
        const facturaId = req.params.idfacturacion;

        const { metodoPago } = req.body;  

        let factura = await Facturaciones.findById(facturaId);

        if (!factura) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }

     
        factura.metodoPago = metodoPago;

       
        const facturaActualizada = await factura.save();

        res.json(facturaActualizada);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// exports.editarFacturacion = async (req, res) => {
//     try {
//         const facturaId = req.params.idfacturacion; 
        
//         const {
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
//         } = req.body;

       
//         let factura = await Facturaciones.findById(facturaId);

//         if (!factura) {
//             return res.status(404).json({ message: 'Factura no encontrada' });
//         }

       
//         factura.idcliente = idcliente;
//         factura.nombreCliente = nombreCliente;
//         factura.fecha = fecha;
//         factura.metodoPago = metodoPago;
//         factura.idPlan = idPlan;
//         factura.nombrePlan = nombrePlan;
//         factura.precioPlan = precioPlan;
//         factura.idproducto = idproducto;
//         factura.nombreProducto = nombreProducto;
//         factura.precioProducto = precioProducto;
//         factura.CantidadProducto = CantidadProducto;
//         factura.subtotal = subtotal;
//         factura.descuento = descuento;
//         factura.totalPagar = totalPagar;

        
//         const facturaActualizada = await factura.save();

      
//         res.json(facturaActualizada);
//     } catch (error) {
      
//         res.status(500).json({ message: error.message });
//     }
// };



exports.eliminarFacturacion = async (req, res) => {
    try {
        await Facturaciones.findByIdAndDelete(req.params.id);
        res.json({ message: "Factura eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const enviarCorreoFactura = async (emailDestino, factura,datosExtras) => {
  try {
    // Aquí debes pasar los datos extras para el PDF, por ejemplo:
 const pdfPath = await generarPDFConDiseno(factura, datosExtras);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'Manuelserbellon@gmail.com',
        pass: 'esosztvdavmyfqcq'
      }
    });

    const mailOptions = {
      from: 'Manuelserbellon@gmail.com',
      to: emailDestino,
      subject: `Factura ID ${factura._id}`,
      text: `Hola ${factura.nombreCliente},\n\nAdjunto encontrarás tu factura en formato PDF.`,
      attachments: [
        {
          filename: `Factura-${factura._id}.pdf`,
          path: pdfPath
        }
      ]
    };

    await transporter.sendMail(mailOptions);

 
    fs.unlink(pdfPath, () => {});

    return true;

  } catch (error) {
    console.error('Error enviando correo con PDF:', error);
    return false;
  }
};



exports.enviarFacturaPorCorreo = async (req, res) => {
  try {
    const factura = await Facturaciones.findById(req.params.idfacturacion);
    if (!factura) return res.status(404).json({ message: "Factura no encontrada" });

    const { emailDestino } = req.body;
    if (!emailDestino) return res.status(400).json({ message: "Debes proporcionar un correo de destino" });


    const plan = await Planes.findById(factura.idPlan);
    console.log("Plan encontrado:", plan);
    const producto = await Productos.findById(factura.idproducto);
console.log("Producto encontrado:", producto);
    const datosExtras = {
      nombrePlan: plan?.nombrePlan  || 'Sin plan',
      nombreProducto: producto?.nombreProducto  || 'Sin producto'
    };


    res.json({ message: "Factura en proceso de envío" });


    setImmediate(async () => {
      const enviado = await enviarCorreoFactura(emailDestino, factura, datosExtras);
      if (!enviado) console.error("Fallo el envío de la factura");
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


async function generarPDFConDiseno(factura, datosExtras) {
  const templateHtml = fs.readFileSync(path.join(__dirname, '../templates/factura.html'), 'utf8');
  const template = Handlebars.compile(templateHtml);

  const facturaPlain = factura.toObject();

  const context = {
    ...facturaPlain,
    totalProducto: (facturaPlain.CantidadProducto || 1) * (facturaPlain.precioProducto || 0),
    nombrePlan: datosExtras.nombrePlan,
    nombreProducto: datosExtras.nombreProducto,
    fecha: new Date(facturaPlain.fecha).toLocaleDateString('es-HN')
  };

  console.log("Datos que recibe el template:", context);

  const html = template(context);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const pdfPath = path.join(__dirname, `factura_${factura._id}.pdf`);
  await page.pdf({ path: pdfPath, format: 'A4' });
  await browser.close();
  return pdfPath;
}
