const passport = require('passport');
const Usuario = require('../models/usuariosModels');
//Se está importando la estrategia de autenticación JWT de la biblioteca 'passport-jwt'. La estrategia JWT proporciona una forma de autenticar las solicitudes utilizando un JWT. 
const estrategiaJWT = require('passport-jwt').Strategy;
//En esta línea, se está importando la función ExtractJwt de la biblioteca 'passport-jwt'. Esta función se utiliza para extraer y decodificar el JWT de una solicitud entrante.
const extraerJWT = require('passport-jwt').ExtractJwt;
const JWT = require('jsonwebtoken');
// moment:manejo de fechas y horarios 
const moment = require('moment');
//se establece el tiempo de duracion del token generado
const expiracion = moment.duration(1, "d").asSeconds();
//claveToken sera mi clave secreta para firmar la generacion del token
const claveToken = 'P@Ssw0rd';

exports.getToken = (data) => {
    return JWT.sign(data,claveToken, {expiresIn: expiracion});
    //imprimir la data que se guarda
    console.log(data);
};

/*  El objeto opciones se utiliza para configurar la estrategia de autenticación basada en JWT. Define cómo se extrae el token de la solicitud y qué clave secreta se utiliza para verificar la firma del token.
-jwtFromRequest:Define cómo se extrae el token JWT de la solicitud entrante.
-El método fromAuthHeaderAsBearerToken() indica que el token se espera que esté en el encabezado de autenticación en el formato "Bearer <token>".
-secretOrKey: Esta propiedad define la clave secreta utilizada para verificar la firma del token JWT.
Esta clave secreta debe coincidir con la clave utilizada para firmar el token JWT en el momento de su generación.
*/
const opciones = {
    jwtFromRequest: extraerJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: claveToken
};
/*
Se configura una estrategia de autenticación basada en JWT utilizando Passport.js. 
La estrategia busca un usuario en la base de datos que cumpla con ciertos criterios y devuelve el resultado o un indicador de error a través de la función done.
*/
passport.use(new estrategiaJWT(opciones, async (payload, done) => {
    return await Usuario.findOne({
        where: {
            idusuario: payload.idusuario,
            estado: 'Activo'
        }
    })
        .then((data) => {
            console.log(data);
            return done(null, data.idusuario);
        })
        .catch((error) => {
            console.log(error);
            return done(null, false);   
        });
}));
//
exports.ValidarAutendicado =
    passport.authenticate('jwt', {
        session: false, failureRedirect: '/api/autenticacion/error'
    });