const mongoose = require('mongoose');

const personaSchema = new mongoose.Schema({
  idpersona: { type: Number, required: true, unique: true },
  idusuario: { type: Number, required: true }, // Según tu ejemplo, es un número, no un ObjectId
  apellidos: { type: String, required: true },
  cedula: { type: String, required: true },
  nombres: { type: String, required: true },
  fechanacimiento: { type: String, required: true }, // Si es formato DD-MM-YYYY como tu ejemplo
  sexo: { type: String, enum: ['M', 'F'], required: true }
});

module.exports = mongoose.model('Persona', personaSchema, 'persona');
