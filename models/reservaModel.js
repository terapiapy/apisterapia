const mongoose = require('mongoose');

// Definir el esquema para la colección reserva
const reservaSchema = new mongoose.Schema({
  idusuario:  { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }, // Relación con la colección Persona
  idespecialista:  { type: mongoose.Schema.Types.ObjectId, ref: 'Especialista', required: true },// Relación con la colección Especialista
  idhorario:  { type: mongoose.Schema.Types.ObjectId, ref: 'HorarioEspecialista', required: true },// Relación con la colección Horario Especialista
  monto: { type: String, default: '' },
  codigopago: { type: String, required: true }
});

// Exportar el modelo
module.exports = mongoose.model('Reserva', reservaSchema, 'reserva');
