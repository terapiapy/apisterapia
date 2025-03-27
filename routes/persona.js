const express = require('express');
const router = express.Router();
const Persona = require('../models/personaModel');

// Crear una nueva persona (CREATE)
router.post('/', async (req, res) => {
  try {
    const nuevaPersona = new Persona(req.body);
    const personaGuardada = await nuevaPersona.save();
    res.status(201).json(personaGuardada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todas las personas (READ)
router.get('/', async (req, res) => {
  try {
    const personas = await Persona.find();
    res.json(personas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una persona por su idpersona (READ)
router.get('/:idpersona', async (req, res) => {
  try {
    const persona = await Persona.findOne({ idpersona: req.params.idpersona });
    if (!persona) return res.status(404).json({ error: 'Persona no encontrada' });
    res.json(persona);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una persona por idpersona (UPDATE)
router.put('/:idpersona', async (req, res) => {
  try {
    const personaActualizada = await Persona.findOneAndUpdate(
      { idpersona: req.params.idpersona },
      req.body,
      { new: true }
    );
    if (!personaActualizada) return res.status(404).json({ error: 'Persona no encontrada' });
    res.json(personaActualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar una persona por idpersona (DELETE)
router.delete('/:idpersona', async (req, res) => {
  try {
    const personaEliminada = await Persona.findOneAndDelete({ idpersona: req.params.idpersona });
    if (!personaEliminada) return res.status(404).json({ error: 'Persona no encontrada' });
    res.json({ mensaje: 'Persona eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
