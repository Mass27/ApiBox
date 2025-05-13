const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const UsuariosSchema = mongoose.Schema(
    {
        idusuario: {
            type: Number,
            auto: true, 
        },
        tipoUsuario: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Logins", 
            required: true 
        },
        usuarioLogin: {
            type: String,
            ref: "Logins",
            required: false
        },
        nombreUsuario: {
            type: String,
            required: true
        },
        correo: {
            type: String,
            required: true,
            unique: true, 
            match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Por favor, introduce una dirección de correo electrónico válida']
        },
        contrasenalogin: {
            type: String,
            required: true,
        },
        fallido: {
            type: Number,
            default: 0 
        },
        estado: {
            type: String,
            required: true,
        },
     

    },
    {
        timestamps: true,
    }
);

UsuariosSchema.plugin(AutoIncrement, { inc_field: 'idusuario' });

const Usuarios = mongoose.model("Usuarios", UsuariosSchema);
module.exports = Usuarios;