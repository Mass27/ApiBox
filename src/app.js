const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require("cors");
const models = require('./models/indexModels');
const socket = require('socket.io');
const connectDB = require('./configuraciones/db');
require('dotenv').config();
const restarDiasClientes = require('./cron/restarDiasClientes');


//inicio del servidor
const app = express();
app.use(cors());
app.use(express.json());


// Conectar a la base de datos
connectDB();

// Accede a los modelos individualmente según tus necesidades
const { Clientes, Empleados, Facturacion, Plan, Producto, Metrica } = models;

app.use('/api/', require('./rutas/indexRoute'));
app.use('/api/empleados/', require('./rutas/empleadosRoute'));
app.use('/api/clientes/', require('./rutas/clientesRoute'));
app.use('/api/planes/', require('./rutas/planesRoute'));
app.use('/api/productos/', require('./rutas/productosRoute'));
app.use('/api/facturacion/', require('./rutas/facturacionRoute'));
app.use('/api/usuarios', require('./rutas/usuariosRoute'));
app.use('/api/logins/', require('./rutas/loginsRoute'))
app.use('/api/autenticacion/', require('./rutas/autenticacionRoute'));
app.use('/api/rutinas', require('./rutas/routineRoute'));
app.use('/api/metricas', require('./rutas/metricasRoute'));
//restarDiasClientes();
const server = app.listen(process.env.PORT, () =>
    console.log(`Server started http://localhost:${process.env.PORT}`)
);