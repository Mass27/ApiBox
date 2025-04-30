const { validationResult } = require('express-validator');
const Logins = require("../models/loginsModels"); // Asegúrate de proporcionar la ruta correcta
const MSJ = require('../componentes/mensaje');
const bcrypt = require('bcrypt'); 



exports.Inicio = (req, res) => {
    const moduloLogins = {
        modulo: 'Logins',
        descripcion: 'Contiene la informacion de los niveles de usuario',
        rutas: [
            {
                ruta: '/api/logins/listar',
                descripcion: 'Lista los logins',
                metodo: 'GET',
                parametros: ''
            },
            {
                ruta: '/api/logins/listarById',
                descripcion: 'Lista los logins por Id',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/logins/guardar',
                descripcion: 'Guarda los logins',
                metodo: 'POST',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/logins/editar',
                descripcion: 'Modifica los logins',
                metodo: 'PUT',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/logins/eliminar',
                descripcion: 'Eliminar los logins',
                metodo: 'DELETE',
                parametros: 'ninguno'
            }
        ]
    }
    MSJ('Peticion Usuario ejecutada correctamente', 200, moduloLogins, [], res);
}

exports.listarLogins = async (req, res) => {
    try {
        // Obtener todos los registros de la colección de Logins
        const logins = await Logins.find();

        // Verificar si hay registros
        if (!logins || logins.length === 0) {
            return res.status(404).json({ message: "No se encontraron registros de Logins" });
        }

        // Retornar los registros como respuesta
        res.json(logins);
    } catch (error) {
        // Manejar errores
        res.status(500).json({ message: error.message });
    }
};

// otra funcion de guardar pero con bcrypt
exports.guardarLogin = async (req, res) => {
    const { usuarioLogin, contrasena, descripcion, correo, estado, permisos } = req.body;

    try {
        // Crear un nuevo objeto de login con los datos proporcionados
        const nuevoLogin = new Logins({
            usuarioLogin: usuarioLogin,
            descripcion: descripcion,
            estado: estado,
            correo: correo,
            permisos: permisos
        });

        // Guardar el login en la base de datos
        const loginGuardado = await nuevoLogin.save();

        // Retornar el login guardado como respuesta
        res.status(201).json(loginGuardado);
    } catch (error) {
        // Si ocurre un error, manejar la excepción
        res.status(500).json({ message: error.message });
    }
};

exports.editar = async (req, res) => {
    const { _id } = req.params; // Obtener el ID del usuario a editar de los parámetros de la URL
    const { usuarioLogin, descripcion, estado, permisos } = req.body; // Obtener los nuevos datos del usuario de la solicitud

    try {
        // Buscar el usuario por su ID
        let login = await Logins.findById(_id);

        // Verificar si el usuario existe
        if (!login) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualizar los campos del usuario con los nuevos valores
        login.usuarioLogin = usuarioLogin;
        login.descripcion = descripcion;
        login.estado = estado;
        login.permisos = permisos;

        // Guardar los cambios en la base de datos
        const loginActualizado = await login.save();

        // Retornar el usuario actualizado como respuesta
        res.json(loginActualizado);
    } catch (error) {
        // Manejar errores
        res.status(500).json({ message: error.message });
    }
};




