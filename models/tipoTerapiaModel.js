const mongoose = require('mongoose');

const tipoterapiaSchema = new mongoose.Schema({
  tituloterapia: { type: String, required: true },
  descripcion: { type: String, required: true },
  procedimiento: { type: String, required: true },
  imagen: { type: String } // URL de la imagen
});

// Verificamos si el modelo 'Tipoterapia' ya existe, si no, lo definimos
const Tipoterapia = mongoose.models.Tipoterapia || mongoose.model('Tipoterapia', tipoterapiaSchema, 'tipoterapia');

module.exports = Tipoterapia;