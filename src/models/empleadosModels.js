const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

// AutoIncrement.initialize(mongoose.connection, { overwrite: true });

const EmpleadoSchema = mongoose.Schema(
    {
        // No es necesario definir "auto" aquí, ya que el plugin lo manejará
        idempleado: {
            type: Number,
            auto: true,
            unique:true
        },
        nombreCompleto: {
            type: String,
            required: true,
            unique: {
                arg: true,
                msg: 'el nombre ya se encuentra asignado'
            },
        },
        identidad: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function(value) {
                    return /^\d{13}$/.test(value);
                },
                message: props => `${props.value} no es una identidad válida. Debe contener exactamente 13 caracteres numéricos.`,
            },
        },
        numeroTelefono: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function(v) {
                    return /^\d{8}$/.test(v); // Expresión regular para validar 8 caracteres numéricos
                },
                message: props => `${props.value} no es un número de teléfono válido. Debe tener exactamente 8 caracteres.`
            }
        },
        correo: {
            type: String,
            required: true,
            unique: true,
            match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Por favor, introduce una dirección de correo electrónico válida']
        },
    },
    {
        timestamps: true,
    }
);

EmpleadoSchema.plugin(AutoIncrement, { inc_field: 'idempleado' });

const Empleados = mongoose.model("Empleados", EmpleadoSchema);

module.exports = Empleados;
