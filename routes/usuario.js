var express = require('express');
var bcrypt = require('bcryptjs'); 
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Usuario = require('../models/usuario');


app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email role').exec((err, usuarios) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuarios',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            usuarios: usuarios
            });
    })
});


// Actualizar  usuario

app.put("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }

        if (!usuario){
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con id' + id + ' no existe.',
                errors: {message: 'No existe un usuario con ese ID'}
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        usuario.save

        usuario.save((err, usuarioGuardado) =>{
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizando usuario',
                    errors: err
                });
            }
    
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
                });
        });
    });
});


// Crear usuario

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioGuardado) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando usuarios',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
            });
    });
});

module.exports = app;