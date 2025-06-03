const Rutinas = require("../models/routinemodel"); 
const MSJ = require('../componentes/mensaje');
const multer = require('multer');
const { unlinkSync } = require('fs');
const cloudinary = require('cloudinary').v2; 
const puppeteer = require('puppeteer');
const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.Inicio = (req, res) => {
    const moduloRutinas = {
        modulo: 'rutinas',
        descripcion: 'Contiene la informacion de las rutinas asignadas a los empleados',
        rutas: [
            {
                ruta: '/api/rutinas/listar',
                descripcion: 'Lista las rutinas',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/rutinas/guardar',
                descripcion: 'Guarda una nueva rutina',
                metodo: 'POST',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/rutinas/editar',
                descripcion: 'Modifica una rutina',
                metodo: 'PUT',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/rutinas/eliminar',
                descripcion: 'Eliminar una rutina',
                metodo: 'DELETE',
                parametros: 'ninguno'
            }
        ]
    }
    MSJ('Peticion Rutinas ejecutada correctamente', 200, moduloRutinas, [], res);
}


exports.listarRutinas = async (req, res) => {
    try {
        const rutinas = await Rutinas.find();
        res.json(rutinas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.obtenerRutinaPorId = async (req, res) => {
    try {
        const rutinaId = req.params.idrutina;

        const rutina = await Rutinas.findById(rutinaId); 

        if (!rutina) {
            return res.status(404).json({ message: "Rutina no encontrada" });
        }

        res.json(rutina);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.guardarRutina = async (req, res) => {
    const rutina = new Rutinas(req.body);

    try {
        const nuevaRutina = await rutina.save();
        res.status(201).json(nuevaRutina);
    } catch (error) {
        console.error("❌ Error al guardar:", error);
        res.status(400).json({ message: error.message });
    }
};


exports.editarRutina = async (req, res) => {
    try {
        const rutinaId = req.params.idrutina;
        const rutina = await Rutinas.findByIdAndUpdate(rutinaId, req.body, { new: true });
        res.json(rutina);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.eliminarRutina = async (req, res) => {
    try {
        const rutinaId = req.params.idrutina;
        const rutina = await Rutinas.findOneAndDelete(rutinaId, req.body, { new: true });
        res.json('rutina eliminada correctamente');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.buscarRutinaPorNombre = async (req, res) => {
    try {
        const nombre = req.params.nombre;

        const rutina = await Rutinas.find({ nombre: { $regex: new RegExp(nombre, "i") } });

        if (!rutina) {
            return res.status(404).json({ message: 'Rutina no encontrada' });
        }

        res.json(rutina);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.generarPDF = async (req, res) => {
    const rutinaId = req.params.idrutina;

    try {
        const rutina = await Rutinas.findById(rutinaId).populate('empleado');

        if (!rutina) {
            return res.status(404).json({ message: 'Rutina no encontrada' });
        }

        const doc = new PDFDocument({ size: 'A4', margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="rutina.pdf"');
        doc.pipe(res);

        // Encabezado
        doc
            .fillColor('red')
            .fontSize(26)
            .font('Helvetica-Bold')
            .text('PLAN DE RUTINA', { align: 'center' })
            .moveDown(1.5);

        // Datos de la rutina
        doc
            .fillColor('black')
            .fontSize(16)
            .font('Helvetica-Bold')
            .text(`Nombre de la Rutina: `, { continued: true })
            .font('Helvetica')
            .text(`${rutina.nombre}`)
            .moveDown(0.5);

        doc
            .font('Helvetica-Bold')
            .text(`Descripción: `, { continued: true })
            .font('Helvetica')
            .text(`${rutina.descripcion}`)
            .moveDown(0.5);

        doc
            .font('Helvetica-Bold')
            .text(`Fecha de Inicio: `, { continued: true })
            .font('Helvetica')
            .text(`${rutina.fechaInicio}`)
            .moveDown(0.5);

        doc
            .font('Helvetica-Bold')
            .text(`Fecha de Fin: `, { continued: true })
            .font('Helvetica')
            .text(`${rutina.fechaFin}`)
            .moveDown(0.5);

        doc
            .font('Helvetica-Bold')
            .text(`Empleado Asignado: `, { continued: true })
            .font('Helvetica')
            .text(`${rutina.empleado.nombreCompleto}`)
            .moveDown(1.5);

        // Línea separadora
        doc
            .moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .strokeColor('#E53E3E')
            .lineWidth(2)
            .stroke()
            .moveDown(1.5);

        // Sección de Ejercicios
        doc
            .fillColor('red')
            .fontSize(18)
            .font('Helvetica-Bold')
            .text('Lista de Ejercicios')
            .moveDown(1);

        rutina.ejercicios.forEach((ejercicio, index) => {
            doc
                .fillColor('black')
                .fontSize(14)
                .font('Helvetica-Bold')
                .text(`${index + 1}. ${ejercicio.nombre}`)
                .font('Helvetica')
                .fontSize(12)
                .text(`- Repeticiones: ${ejercicio.repeticiones}`)
                .text(`- Series: ${ejercicio.series}`)
                .text(`- Descanso: ${ejercicio.descanso}`)
                .moveDown(1);
        });

        // Línea final
        doc
            .moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .strokeColor('#E53E3E')
            .lineWidth(1)
            .stroke()
            .moveDown(2);

        // Pie de página
        doc
            .fontSize(10)
            .fillColor('gray')
            .text('Documento generado automáticamente por el sistema Boxing Club', 50, 780, { align: 'center' });

        doc.end();

    } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).json({ message: error.message });
    }
};
