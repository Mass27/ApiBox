
const Clientes = require('./clientesModels');
const Empleados = require('./empleadosModels');
const Facturacion = require('./facturacionModels');
const Logins = require('./loginsModels');
const Plan = require('./planesModels');
const Producto = require('./productosModels');
const Usuarios = require('./usuariosModels');
const Rutinas = require('./routinemodel'); 


exports.crearModelos = async () => {

    await Empleados.sync().then(()=>{
        console.log('Modelo Empleados Creado correctamente');
    })
    await Clientes.sync().then(()=>{
        console.log('Modelo Clientes Creado correctamente');
    })
    await Plan.sync().then(()=>{
        console.log('Modelo Plan Creado correctamente');
    })
    await Facturacion.sync().then(()=>{
        console.log('Modelo Facturacion Creado correctamente');
    })
    await Producto.sync().then(()=>{
        console.log('Modelo Producto Creado correctamente');
    })
    await Usuarios.sync().then(()=>{
        console.log('Modelo Usuarios Creado correctamente');
    })
    await Logins.sync().then(()=>{
        console.log('Modelo Logins Creado correctamente');
    })
    await Rutinas.sync().then(()=>{  
        console.log('Modelo Rutinas Creado correctamente');
    })
};

