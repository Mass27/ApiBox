const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const RutinaSchema = mongoose.Schema(
    {
      
        nombre: {
            type: String,
            required: true,
            unique: false,
            trim: true
        },
    
        descripcion: {
            type: String,
            required: true,
        },
   
        ejercicios: [{
            nombre: { type: String, required: true },
            repeticiones: { type: Number, required: true },
            series: { type: Number, required: true },
            descanso: { type: String, required: true }
        }],
     
        fechaInicio: {
            type: Date,
            required: true
        },
 
        fechaFin: {
            type: Date,
            required: true
        },
      
        empleado: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Empleados',
            required: true
        },
    },
    {
        timestamps: true,  
    }
);


const Rutinas = mongoose.model("Rutinas", RutinaSchema);

module.exports = Rutinas;
