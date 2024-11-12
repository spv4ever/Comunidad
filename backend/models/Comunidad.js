const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const movimientoSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now },
  concepto: { type: String, required: true },
  importe: { type: Number, required: true },
  informacionAdicional: { type: String },
  tipo: { type: String, enum: ['ingreso', 'gasto'], required: true }
});

const comunidadSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  nombreUsuario: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  banco: [movimientoSchema],
  caja: [movimientoSchema]
});
 
// Encriptar la contraseña antes de guardar el usuario
comunidadSchema.pre('save', async function (next) {
  if (!this.isModified('contraseña')) return next();
  const salt = await bcrypt.genSalt(10);
  this.contraseña = await bcrypt.hash(this.contraseña, salt);
  next();
});

const Comunidad = mongoose.model('Comunidad', comunidadSchema);
module.exports = Comunidad;
