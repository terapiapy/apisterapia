const mongoose = require('mongoose');

// Definir el esquema para la colección sala
const salaSchema = new mongoose.Schema({
  idsala: { type: Number, required: true, unique: true },
  estatus: { type: String, required: true, enum: ['programado', 'ocupado', 'disponible'], default: 'programado' },
  descripcion: { type: String, required: true }
});

// Exportar el modelo
module.exports = mongoose.model('Sala', salaSchema, 'sala');
