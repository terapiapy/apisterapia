const mongoose = require('mongoose');

const tipoterapiaSchema = new mongoose.Schema({
  idtipo: { type: Number, required: true, unique: true },
  tituloterapia: { type: String, required: true },
  descripcion: { type: String, required: true },
  procedimiento: { type: String, required: true }
});

module.exports = mongoose.model('Tipoterapia', tipoterapiaSchema, 'tipoterapia');
