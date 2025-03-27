const express = require('express');
const router = express.Router();
const Reserva = require('../models/reservaModel');

// Crear una nueva reserva
router.post('/', async (req, res) => {
  const { idreserva, idpersona, idespecialista, idhorario, monto, codigopago } = req.body;

  try {
    const reserva = new Reserva({
      idreserva,
      idpersona,
      idespecialista,
      idhorario,
      monto,
      codigopago
    });

    await reserva.save();
    res.status(201).json({ message: 'Reserva creada con éxito' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las reservas
router.get('/', async (req, res) => {
  try {
    const reservas = await Reserva.find() // Obtiene todas las reservas
      .populate('idpersona', 'nombres apellidos') // Relacionar la colección Persona
      .populate('idespecialista', 'nombresespecialista apellidosespecialista') // Relacionar la colección Especialista
      .populate('idhorario', 'dia hora'); // Relacionar la colección Horario

    res.json(reservas); // Devuelve el listado de reservas en formato JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una reserva por id
router.get('/:idreserva', async (req, res) => {
  try {
    const reserva = await Reserva.findOne({ idreserva: req.params.idreserva })
      .populate('idpersona', 'nombres apellidos')
      .populate('idespecialista', 'nombresespecialista apellidosespecialista')
      .populate('idhorario', 'dia hora');

    if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });
    res.json(reserva);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una reserva
router.put('/:idreserva', async (req, res) => {
  try {
    const reservaActualizada = await Reserva.findOneAndUpdate(
      { idreserva: req.params.idreserva },
      req.body,
      { new: true } // Devuelve la reserva actualizada
    );

    if (!reservaActualizada) return res.status(404).json({ error: 'Reserva no encontrada' });
    res.json(reservaActualizada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar una reserva
router.delete('/:idreserva', async (req, res) => {
  try {
    const reservaEliminada = await Reserva.findOneAndDelete({ idreserva: req.params.idreserva });
    if (!reservaEliminada) return res.status(404).json({ error: 'Reserva no encontrada' });
    res.json({ mensaje: 'Reserva eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
