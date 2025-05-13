const mongoose = require("mongoose");

const LoginsSchema = mongoose.Schema(
    {
        usuarioLogin: {
            type: String,
            required: false,
            unique: true, 
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
                default: false, 
            },
            eliminar: {
                type: Boolean,
                default: false, 
            },
            crear: {
                type: Boolean,
                default: false, 
            },
            listar: {
                type: Boolean,
                default: false, 
            }
        }
    },
    {
        timestamps: true,
    }
);

const Logins = mongoose.model("Logins", LoginsSchema);
module.exports = Logins