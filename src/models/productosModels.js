const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const ProductosSchema = mongoose.Schema(
    {
        // idproducto: {
        //     type: Number,
        //     auto: true, 
        // },
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
    },
    {
        timestamps: true,
    }
);


// ProductosSchema.plugin(AutoIncrement, { inc_field: 'idproducto' });

const Productos = mongoose.model("Productos", ProductosSchema);
module.exports = Productos;
