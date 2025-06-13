const mongoose = require("mongoose");

const ProductosSchema = mongoose.Schema(
  {
    imagen: {
      type: String,
      required: false,
    },
    nombreProducto: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: false,
    },
    precio: {
      type: Number,
      required: true,
    },
    cantidadEnStock: {
      type: Number,
      required: true,
    },
   estado: {
  type: String,
  enum: ['En existencia', 'Agotado'],
  default: 'En existencia'
}
  },
  {
    timestamps: true,
  }
);

const Productos = mongoose.model("Productos", ProductosSchema);
module.exports = Productos;
