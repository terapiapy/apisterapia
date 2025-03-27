const express = require('express');
const router = express.Router();
const Sala = require('../models/salaModel');

// Crear una nueva sala
router.post('/', async (req, res) => {
  const { idsala, estatus, descripcion } = req.body;

  try {
    const sala = new Sala({
      idsala,
      estatus,
      descripcion
    });

    await sala.save();
    res.status(201).json({ message: 'Sala creada con éxito' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las salas
router.get('/', async (req, res) => {
  try {
    const salas = await Sala.find(); // Obtiene todas las salas
    res.json(salas); // Devuelve el listado de salas en formato JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una sala por id
router.get('/:idsala', async (req, res) => {
  try {
    const sala = await Sala.findOne({ idsala: req.params.idsala });
    if (!sala) return res.status(404).json({ error: 'Sala no encontrada' });
    res.json(sala);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una sala
router.put('/:idsala', async (req, res) => {
  try {
    const salaActualizada = await Sala.findOneAndUpdate(
      { idsala: req.params.idsala },
      req.body,
      { new: true } // Devuelve la sala actualizada
    );

    if (!salaActualizada) return res.status(404).json({ error: 'Sala no encontrada' });
    res.json(salaActualizada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar una sala
router.delete('/:idsala', async (req, res) => {
  try {
    const salaEliminada = await Sala.findOneAndDelete({ idsala: req.params.idsala });
    if (!salaEliminada) return res.status(404).json({ error: 'Sala no encontrada' });
    res.json({ mensaje: 'Sala eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
