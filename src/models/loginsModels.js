const mongoose = require("mongoose");

const LoginsSchema = mongoose.Schema(
    {
        usuarioLogin: {
            type: String,
            required: false,
            unique: true, // Usuario único
        },
        descripcion: {
            type: String,
            required: true,
        },
        estado: {
            type: String,
            enum: ['Activo', 'Inactivo', 'Pendiente'],
            default: 'Activo'
        },
        permisos: {
            editar: {
                type: Boolean,
                default: false, // Valor predeterminado: false
            },
            eliminar: {
                type: Boolean,
                default: false, // Valor predeterminado: false
            },
            crear: {
                type: Boolean,
                default: false, // Valor predeterminado: false
            },
            listar: {
                type: Boolean,
                default: false, // Valor predeterminado: false
            }
        }
    },
    {
        timestamps: true,
    }
);

const Logins = mongoose.model("Logins", LoginsSchema);
module.exports = Logins