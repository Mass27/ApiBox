
exports.Inicio = (req, res) => {
    const boxclub={
        api: 'Interfaz de programacion del sistema BoxClub',
        boxclub: 'Sistema de Boxing club',
        desarrollador: 'Manuel Servellon',
        modulos:[
            { nombre: 'rutinas', ruta: '/api/rutinas' },
            {nombre: 'clientes', ruta: '/api/clientes'},
            {nombre: 'productos', ruta: '/api/productos'},
            {nombre: 'planes', ruta: '/api/planes'},
            {nombre: 'facturacion', ruta: '/api/facturacion'},
            {nombre: 'usuario', ruta: '/api/usuario'},
            {nombre: 'autenticacion', ruta: '/api/autenticacion'},
        ]
    }
    res.json(boxclub);
};

