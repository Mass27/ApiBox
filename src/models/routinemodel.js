const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const RutinaSchema = mongoose.Schema(
    {
        // Nombre de la rutina
        nombre: {
            type: String,
            required: true,
            unique: false,
            trim: true
        },
        // Descripción de la rutina
        descripcion: {
            type: String,
            required: true,
        },
        // Ejercicios que componen la rutina (array de objetos o strings)
        ejercicios: [{
            nombre: { type: String, required: true },
            repeticiones: { type: Number, required: true },
            series: { type: Number, required: true },
            descanso: { type: String, required: true }
        }],
        // Fecha de inicio de la rutina
        fechaInicio: {
            type: Date,
            required: true
        },
        // Fecha de fin de la rutina
        fechaFin: {
            type: Date,
            required: true
        },
        // Relación con el cliente (Empleado)
        empleado: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Empleados',
            required: true
        },
    },
    {
        timestamps: true,  // para guardar las fechas de creación y actualización automáticamente
    }
);

// RutinaSchema.plugin(AutoIncrement, { inc_field: 'idrutina' });

const Rutinas = mongoose.model("Rutinas", RutinaSchema);

module.exports = Rutinas;
