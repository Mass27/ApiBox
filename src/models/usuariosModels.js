const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const UsuariosSchema = mongoose.Schema(
    {
        idusuario: {
            type: Number,
            auto: true, // Activa la autoincrementación
        },
        tipoUsuario: {
            type: mongoose.Schema.Types.ObjectId, // Cambia el tipo a ObjectId para hacer referencia a los Logins
            ref: "Logins", // Hace referencia al modelo de Logins
            required: true // Especifica que se requiere un Login para cada Usuario
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
            unique: true, // Correo electrónico único
            match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Por favor, introduce una dirección de correo electrónico válida']
        },
        contrasenalogin: {
            type: String,
            required: true,
        },
        fallido: {
            type: Number,
            default: 0 // Valor predeterminado 0 para fallido
        },
        estado: {
            type: String,
            required: true,
        },
        // Otros campos de usuario...

    },
    {
        timestamps: true,
    }
);

UsuariosSchema.plugin(AutoIncrement, { inc_field: 'idusuario' });

const Usuarios = mongoose.model("Usuarios", UsuariosSchema);
module.exports = Usuarios;