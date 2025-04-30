const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const FacturacionSchema = mongoose.Schema(
    {
        numeroFactura: {
            type: Number,
            unique: true
        },
        idcliente:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clientes",
            required: true,
        },
        nombreCliente: {
            type: String,
            ref: "Clientes",
            required: true,
        },
        fecha: {
            type: Date,
            default:Date.now(),
        },
        metodoPago: {
            type: String,
            required: true,
        },
        idPlan:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Planes",
            required: false,
        },
        nombrePlan: {
            type: String,
            ref: "Planes",
            required: false,
        },
        precioPlan:{   
            type: Number,
            ref: "Planes",
            required: false,
        },
        idproducto:{
            type: mongoose.Schema.ObjectId,
            ref: "Productos",
            required: false,
        },
        nombreProducto: {
            type: String,
            ref: "Productos",
            required: false,
        },
        precioProducto:{   
            type: Number,
            ref: "Productos",
            required: false,
        },
        CantidadProducto:{
            type:Number,
            default:1
        },
        subtotal: {
            type: Number,
            required: true,
        },
        descuento: {
            type: Number,
            default: 0,
        },
        totalPagar: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

FacturacionSchema.plugin(AutoIncrement, { inc_field: 'numeroFactura' });

const Facturacion = mongoose.model("Facturacion", FacturacionSchema);

module.exports = Facturacion;
