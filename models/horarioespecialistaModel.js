const mongoose = require('mongoose');

// Definir el esquema para la colección horario_especialista
const horarioEspecialistaSchema = new mongoose.Schema({
  idhorario: { type: Number, required: true, unique: true },
  idespecialista: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Especialista', // Relacionamos con el modelo de especialista
    required: true 
  },
  dia: { type: String, required: true },
  fecha: { type: String, required: true }, // Formato: DD/MM/YYYY
  hora: { type: String, required: true } // Formato: "08:00 a 10:00"
});

// Exportar el modelo
module.exports = mongoose.model('HorarioEspecialista', horarioEspecialistaSchema, 'horario_especialista');
