var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'AGRUPACION_ROLE', 'PENIA_ROLE', 'PRENSA_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, "El nombre es obligatorio"]},
    email: { type: String, unique:true, required: [true, "El correo es obligatorio"]},
    password: { type: String, required: [true, "La contraseña es obligatoria"]},
    role: { type: String, required: true, default: 'AGRUPACION_ROLE', enum: rolesValidos}
});

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe ser único'})

module.exports = mongoose.model('Usuario', usuarioSchema);