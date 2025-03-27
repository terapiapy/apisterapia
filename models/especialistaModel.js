const mongoose = require('mongoose');

const especialistaSchema = new mongoose.Schema({
  idespecialista: { type: Number, required: true, unique: true },
  idtipo: {type: Number, required: true, ref: 'tipoTerapia'},
  nombresespecialista: { type: String, required: true },
  apellidosespecialista: { type: String, required: true },
  foto: { type: String, required: true },  // Suponiendo que sea el nombre de la foto
  especialidad: { type: String, required: true },
  precio: { type: Number, required: true },  // El precio es un número
  rating: { type: String, required: true },  // El rating es una cadena, podría ser un número también
  experiencia: { type: Number, required: true },  // Años de experiencia
  biografia: { type: String, required: true }   // Biografía del especialista
});

module.exports = mongoose.model('Especialista', especialistaSchema, 'especialista');
