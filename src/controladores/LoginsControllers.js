const { validationResult } = require('express-validator');
const Logins = require("../models/loginsModels"); 
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
        
        const logins = await Logins.find();

   
        if (!logins || logins.length === 0) {
            return res.status(404).json({ message: "No se encontraron registros de Logins" });
        }

      
        res.json(logins);
    } catch (error) {
       
        res.status(500).json({ message: error.message });
    }
};


exports.guardarLogin = async (req, res) => {
    const { usuarioLogin, contrasena, descripcion, correo, estado, permisos } = req.body;

    try {
     
        const nuevoLogin = new Logins({
            usuarioLogin: usuarioLogin,
            descripcion: descripcion,
            estado: estado,
            correo: correo,
            permisos: permisos
        });

        
        const loginGuardado = await nuevoLogin.save();

       
        res.status(201).json(loginGuardado);
    } catch (error) {
        
        res.status(500).json({ message: error.message });
    }
};

exports.editar = async (req, res) => {
    const { _id } = req.params; 
    const { usuarioLogin, descripcion, estado, permisos } = req.body; 

    try {
    
        let login = await Logins.findById(_id);

      
        if (!login) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

      
        login.usuarioLogin = usuarioLogin;
        login.descripcion = descripcion;
        login.estado = estado;
        login.permisos = permisos;

       
        const loginActualizado = await login.save();

        res.json(loginActualizado);
    } catch (error) {
     
        res.status(500).json({ message: error.message });
    }
};




