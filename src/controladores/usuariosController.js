const { validationResult } = require('express-validator');
const Usuarios = require("../models/usuariosModels"); 
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

exports.GuardarUsuario = async (req, res) => {
    const {
        tipoUsuario,
        nombreUsuario,
        correo,
        contrasenalogin,
        estado,
        fallido 
    
    } = req.body;

    try {
       
        const hashedPassword = await bcrypt.hash(contrasenalogin, 10);

        
        const infoTipoUsuario = await Logins.findById(tipoUsuario);

        if (!infoTipoUsuario) {
            return res.status(404).json({ message: 'UsuarioLogin no encontrado' });
        }

      
        const nuevoUsuario = new Usuarios({
            tipoUsuario: infoTipoUsuario._id,
           
            nombreUsuario,
            correo,
            contrasenalogin: hashedPassword, 
            estado,
            fallido, 
         
        });

        
        const usuarioGuardado = await nuevoUsuario.save();

       
        res.status(201).json(usuarioGuardado);
    } catch (error) {
    
        console.error(error);
        res.status(500).json({ message: 'Error al guardar usuario' });
    }
};

exports.editarUsuario = async (req, res) => {
    const idUsuario = req.params.idusuario; 
    
    const {
        tipoUsuario,
        nombreUsuario,
        correo,
        contrasenalogin,
        fallido,
        estado,
       
    } = req.body;

    try {
       
        const usuario = await Usuarios.findById(idUsuario);
        const hashedPassword = await bcrypt.hash(contrasenalogin, 10);
       
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

       
        usuario.tipoUsuario = tipoUsuario;
        usuario.nombreUsuario = nombreUsuario;
        usuario.correo = correo;
        usuario.contrasenalogin = hashedPassword;
        usuario.fallido = fallido;
        usuario.estado = estado;
       
 
        const usuarioActualizado = await usuario.save();

       
        res.status(200).json(usuarioActualizado);
    } catch (error) {
        
        res.status(500).json({ message: error.message });
    }
};


exports.eliminarUsuario = async (req, res) => {
    try {
        const idusuario = req.params.idusuario; 

        
        const usuarioInactivo = await Usuarios.findOneAndUpdate(
            { idusuario: idusuario },
            { estado: 'Inactivo' },
            { new: true } 
        );

       
        if (!usuarioInactivo) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

      
        res.json({ message: "Estado de usuario cambiado a 'Inactivo'", usuario: usuarioInactivo });
    } catch (error) {
       
        res.status(500).json({ message: error.message });
    }
};


