const mongoose = require("mongoose");

const MetricaSchema = new mongoose.Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clientes",
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  pesoCorporal: Number, 
  grasaCorporal: Number, 
  imc: Number,
  rutinaActual: String, 
  progreso: String, 
  medidas: {
    cintura: Number,
    pecho: Number,
    biceps: Number,
  },
  nota: String, 
   esHistorial: { type: Boolean, default: false }
});

const Metrica = mongoose.model("Metrica", MetricaSchema);

module.exports = Metrica;
