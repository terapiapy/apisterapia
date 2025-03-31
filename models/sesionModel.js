const mongoose = require('mongoose');

// Definir el esquema para la colección sesion
const sesionSchema = new mongoose.Schema({
    idreserva: { type: mongoose.Schema.Types.ObjectId, ref: 'Reserva', required: true }, // Relación con la reserva
    descripcionsesion: { type: String, default: '' },
    estadosesion: { type: String, enum: ['habilitado', 'cancelado', 'finalizado'], default: 'habilitado' },
    linkdellamada: { type: String, required: true }, // Enlace obligatorio para la llamada
    resena: { type: String, default: '' }, // Reseña opcional
    evaluacion: { type: Number, min: 1, max: 5 }, // Evaluación opcional entre 1 y 5
});

// Exportar el modelo
module.exports = mongoose.model('Sesion', sesionSchema, 'sesion');
