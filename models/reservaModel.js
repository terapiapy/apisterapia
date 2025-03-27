const mongoose = require('mongoose');

// Definir el esquema para la colección reserva
const reservaSchema = new mongoose.Schema({
  idreserva: { type: Number, required: true, unique: true },
  idpersona: { type: Number, required: true, ref: 'Persona' }, // Relación con la colección Persona
  idespecialista: { type: Number, required: true, ref: 'Especialista' }, // Relación con la colección Especialista
  idhorario: { type: Number, required: true, ref: 'HorarioEspecialista' }, // Relación con la colección Horario Especialista
  monto: { type: String, default: '' },
  codigopago: { type: String, required: true }
});

// Exportar el modelo
module.exports = mongoose.model('Reserva', reservaSchema, 'reserva');
