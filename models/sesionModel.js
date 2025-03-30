const mongoose = require('mongoose');

// Definir el esquema para la colección sesion
const sesionSchema = new mongoose.Schema({
  idsala:  { type: mongoose.Schema.Types.ObjectId, ref: 'Sala', required: true }, // Relación con la colección Sala
  idespecialista:  { type: mongoose.Schema.Types.ObjectId, ref: 'Especialsita', required: true },// Relación con la colección Especialista
  idusuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },// Relación con la colección Persona
  descripcionsesion: { type: String, default: '' },
  estadosesion: { type: String, enum: ['habilitado', 'cancelado', 'finalizado'], default: 'habilitado' },
  idhorario:  { type: mongoose.Schema.Types.ObjectId, ref: 'HorarioEspecialista', required: true },// Relación con la colección Horario Especialista
});

// Exportar el modelo
module.exports = mongoose.model('Sesion', sesionSchema, 'sesion');
