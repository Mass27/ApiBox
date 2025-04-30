const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuariosModels');
const Logins = require('../models/loginsModels');
const MSJ = require('../componentes/mensaje');
const passport = require('../configuraciones/passport');
// Validación de errores


exports.inicioSesion = async (req, res) => {
    const errores = validacion(req);

    if (errores.length > 0) {
        return MSJ("Error de validación", 400, [], errores, res);
    }

    try {
        const { nombreUsuario, contrasenalogin } = req.body;

        // Buscar el usuario por nombre de usuario
        const usuario = await Usuario.findOne({ nombreUsuario: nombreUsuario, estado: 'Activo' });

        if (!usuario) {
            return MSJ("Usuario no encontrado", 404, [], [{ mensaje: "El usuario no existe o se encuentra bloqueado", parametro: "nombreUsuario" }], res);
        }

        // Obtener el tipo de usuario asociado desde el modelo de Logins
        const login = await Logins.findById(usuario.tipoUsuario);

        // Verificar la contraseña
        const contrasenaValida = await bcrypt.compare(contrasenalogin, usuario.contrasenalogin);

        if (contrasenaValida) {
            // Generar token de autenticación
            const token = passport.getToken({ idUsuario: usuario._id });

            const data = {
                token: token,
                usuario: {
                    nombreUsuario: usuario.nombreUsuario,
                    correo: usuario.correo,
                    tipoUsuario: login.usuarioLogin,
                    Permisos: login.descripcion
                    // Otros datos del usuario si es necesario
                }
            };

            return MSJ("Inicio de sesión exitoso", 200, data, [], res);
        } else {
            return MSJ("Credenciales inválidas", 401, [], [{ mensaje: "El usuario no existe o la contraseña es incorrecta", parametro: "contrasenalogin" }], res);
        }
    } catch (error) {
        console.error(error);
        return MSJ("Error en el servidor", 500, [], "Error al intentar iniciar sesión", res);
    }
};

function validacion(req) {
    const errores = [];
    const validaciones = validationResult(req);

    if (!validaciones.isEmpty()) {
        validaciones.array().forEach(error => {
            errores.push({
                mensaje: error.msg,
                parametro: error.param
            });
        });
    }

    return errores;
}

exports.Error = async (req, res) => {
    var errores = [
        {
            mensaje: "Debe enviar las credenciales correctas",
            parametro: "autenticacion"
        },
    ];
    MSJ("Peticion ejecutada correctamente", 200, [], errores, res);
};