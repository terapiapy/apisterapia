const mongoose = require('mongoose');

// Definir el esquema para la colección sesion
const sesionSchema = new mongoose.Schema({
  idsesion: { type: Number, required: true, unique: true },
  idsala: { type: Number, required: true, ref: 'Sala' }, // Relación con la colección Sala
  idespecialista: { type: Number, required: true, ref: 'Especialista' }, // Relación con la colección Especialista
  idpersona: { type: Number, required: true, ref: 'Persona' }, // Relación con la colección Persona
  descripcionsesion: { type: String, default: '' },
  estadosesion: { type: String, enum: ['habilitado', 'cancelado', 'finalizado'], default: 'habilitado' },
  idhorario: { type: Number, required: true, ref: 'HorarioEspecialista' } // Relación con la colección Horario Especialista
});

// Exportar el modelo
module.exports = mongoose.model('Sesion', sesionSchema, 'sesion');
