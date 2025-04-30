const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientesSchema = new Schema({
    imagen: {
        type: String,
        required: false
    },
    nombreCompleto: {
        type: String,
        required: true
    },
    identidad: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(value) {
                return /^\d{13}$/.test(value);
            },
            message: props => `${props.value} no es una identidad válida. Debe contener exactamente 13 caracteres numéricos.`,
        },
    },
    numeroTelefono: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    estado: {
        type: String,
        enum: ['Activo', 'Inactivo', 'Pendiente'],
        default: 'Activo'
    },
    fechaIngreso: {
        type: Date,
        default:Date.now(),
    },
    idPlan: {
        type: Schema.Types.ObjectId,
        ref: 'Planes',
        required: false
    },
    nombrePlan: {
        type: String,
        ref: 'Planes',
        required: false
    },
    rutinaAsignada: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rutinas',  // Referencia al modelo de rutinas
        required: false,  // Esto puede ser opcional si el cliente no tiene una rutina asignada por defecto
      },
    // Nuevo campo para almacenar los días restantes del plan
    diasRestantes: {
        type: Number,
        default: 30, // Inicializamos en 30 días al momento del registro
    },
});

const Clientes = mongoose.model('Clientes', ClientesSchema);

module.exports = Clientes;
