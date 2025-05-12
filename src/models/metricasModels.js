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
  pesoCorporal: Number, // kg
  grasaCorporal: Number, // %
  imc: Number,
  rutinaActual: String, // Ej: "Fuerza y resistencia"
  progreso: String, // Ej: "Ha mejorado en resistencia"
  medidas: {
    cintura: Number,
    pecho: Number,
    biceps: Number,
  },
  nota: String, // nota del entrenador o del cliente
});

const Metrica = mongoose.model("Metrica", MetricaSchema);

module.exports = Metrica;
