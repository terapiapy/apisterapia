const mongoose = require('mongoose');

const especialistaSchema = new mongoose.Schema({
  idtipo: { type: mongoose.Schema.Types.ObjectId, ref: 'Tipoterapia', required: true }, // Relación con Tipoterapia
  nombresespecialista: { type: String, required: true },
  apellidosespecialista: { type: String, required: true },
  foto: { type: String, required: true },  // URL o nombre de la imagen
  especialidad: { type: String, required: true },
  precio: { type: Number, required: true },  
  rating: { type: Number, required: true },  // Mejor usar Number para cálculos
  experiencia: { type: Number, required: true },
  biografia: { type: String, required: true }
});

module.exports = mongoose.model('Especialista', especialistaSchema, 'especialista');
