const { validationResult } = require('express-validator');
const Usuarios = require("../models/usuariosModels"); // Asegúrate de proporcionar la ruta correcta
const Logins = require('../models/loginsModels')
const MSJ = require('../componentes/mensaje');
const bcrypt = require('bcrypt'); 

exports.Inicio = (req, res) => {
    const moduloUsuario = {
        modulo: 'Usuarios',
        descripcion: 'Contiene la informacion de los Usuarios',
        rutas: [
            {
                ruta: '/api/usuarios/listar',
                descripcion: 'Lista los Usuario',
                metodo: 'GET',
                parametros: 'usuario, contrasena, correo, codigo, fallido, estado'
            },
            {
                ruta: '/api/usuario/listarById',
                descripcion: 'Lista los usuario por Id',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/usuario/guardar',
                descripcion: 'Guarda los Usuarios',
                metodo: 'POST',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/usuarios/editar',
                descripcion: 'Modifica los Usuarios',
                metodo: 'PUT',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/usuarios/eliminar',
                descripcion: 'Eliminar los Usuarios',
                metodo: 'DELETE',
                parametros: 'ninguno'
            }
        ]
    }
    MSJ('Peticion Usuario ejecutada correctamente', 200, moduloUsuario, [], res);
}

exports.listar = async (req, res) => {
    try {
      const resultado = await Usuarios.aggregate([
        {
          $lookup: {
            from: "Logins",
            localField: "tipoUsuario",
            foreignField: "_id",
            as: "usuarioLogin"
          }
        },
        {
          $unwind: {
            path: "$usuarioLogin",
            preserveNullAndEmptyArrays: true
          }
        }
      ]);
  
      res.json(resultado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al listar usuarios" });
    }
  };
// otra funcion de guardar pero con bcrypt
exports.GuardarUsuario = async (req, res) => {
    const {
        tipoUsuario,
        nombreUsuario,
        correo,
        contrasenalogin,
        estado,
        fallido // Incluimos el campo fallido
        // Otros campos del usuario...
    } = req.body;

    try {
        // Encriptar la contraseña antes de guardarla en la base de datos
        const hashedPassword = await bcrypt.hash(contrasenalogin, 10);

        // Intenta encontrar el tipoUsuario directamente por su ID
        const infoTipoUsuario = await Logins.findById(tipoUsuario);

        if (!infoTipoUsuario) {
            return res.status(404).json({ message: 'UsuarioLogin no encontrado' });
        }

        // Crea un nuevo objeto de usuario con los datos proporcionados
        const nuevoUsuario = new Usuarios({
            tipoUsuario: infoTipoUsuario._id,
              // Solo almacenamos el ID del usuarioLogin
            nombreUsuario,
            correo,
            contrasenalogin: hashedPassword, // Guarda la contraseña cifrada
            estado,
            fallido, // Incluye el campo fallido
            // Otros campos del usuario...
        });

        // Guarda el nuevo usuario en la base de datos
        const usuarioGuardado = await nuevoUsuario.save();

        // Retorna el usuario guardado como respuesta
        res.status(201).json(usuarioGuardado);
    } catch (error) {
        // Maneja los errores adecuadamente
        console.error(error);
        res.status(500).json({ message: 'Error al guardar usuario' });
    }
};

exports.editarUsuario = async (req, res) => {
    const idUsuario = req.params.idusuario; // Obtén el ID del usuario de los parámetros de la ruta
    
    const {
        tipoUsuario,
        nombreUsuario,
        correo,
        contrasenalogin,
        fallido,
        estado,
        // Otros campos del usuario...
    } = req.body;

    try {
        // Buscar el usuario por su ID
        const usuario = await Usuarios.findById(idUsuario);
        const hashedPassword = await bcrypt.hash(contrasenalogin, 10);
        // Verificar si el usuario existe
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualizar todos los campos del usuario con los datos proporcionados
        usuario.tipoUsuario = tipoUsuario;
        usuario.nombreUsuario = nombreUsuario;
        usuario.correo = correo;
        usuario.contrasenalogin = hashedPassword;
        usuario.fallido = fallido;
        usuario.estado = estado;
        // Actualiza otros campos del usuario según sea necesario...

        // Guardar los cambios en la base de datos
        const usuarioActualizado = await usuario.save();

        // Retornar el usuario actualizado como respuesta
        res.status(200).json(usuarioActualizado);
    } catch (error) {
        // Si ocurre un error, manejar la excepción
        res.status(500).json({ message: error.message });
    }
};


exports.eliminarUsuario = async (req, res) => {
    try {
        const idusuario = req.params.idusuario; // Obtener el ID proporcionado en la URL

        // Buscar el usuario por su idusuario y actualizar su estado a "INA"
        const usuarioInactivo = await Usuarios.findOneAndUpdate(
            { idusuario: idusuario },
            { estado: 'Inactivo' },
            { new: true } // Devolver el documento actualizado
        );

        // Si no se encuentra el usuario, retornar un mensaje de error
        if (!usuarioInactivo) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Retornar una respuesta exitosa con el usuario actualizado
        res.json({ message: "Estado de usuario cambiado a 'Inactivo'", usuario: usuarioInactivo });
    } catch (error) {
        // Manejar errores
        res.status(500).json({ message: error.message });
    }
};


