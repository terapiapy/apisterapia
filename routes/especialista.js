const express = require('express');
const router = express.Router();
const Especialista = require('../models/especialistaModel');

// Crear un nuevo especialista (POST)
router.post('/', async (req, res) => {
  const { idespecialista, nombresespecialista, apellidosespecialista, foto, especialidad, precio, rating, experiencia, biografia } = req.body;

  try {
    const especialistaExistente = await Especialista.findOne({ idespecialista });

    if (especialistaExistente) {
      return res.status(400).json({ error: 'El especialista ya está registrado' });
    }

    const especialista = new Especialista({
      idespecialista,
      nombresespecialista,
      apellidosespecialista,
      foto,
      especialidad,
      precio,
      rating,
      experiencia,
      biografia
    });

    await especialista.save();
    res.status(201).json({ message: 'Especialista creado con éxito' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los especialistas (GET)
router.get('/', async (req, res) => {
  try {
    const especialistas = await Especialista.find(); // Obtiene todos los especialistas
    res.json(especialistas); // Devuelve el listado de especialistas en formato JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un especialista por idespecialista (GET)
router.get('/:idespecialista', async (req, res) => {
  try {
    const especialista = await Especialista.findOne({ idespecialista: req.params.idespecialista });
    if (!especialista) return res.status(404).json({ error: 'Especialista no encontrado' });
    res.json(especialista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un especialista (PUT)
router.put('/:idespecialista', async (req, res) => {
  try {
    const especialistaActualizado = await Especialista.findOneAndUpdate(
      { idespecialista: req.params.idespecialista },
      req.body,
      { new: true } // Devuelve el especialista actualizado
    );
    if (!especialistaActualizado) return res.status(404).json({ error: 'Especialista no encontrado' });
    res.json(especialistaActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un especialista (DELETE)
router.delete('/:idespecialista', async (req, res) => {
  try {
    const especialistaEliminado = await Especialista.findOneAndDelete({ idespecialista: req.params.idespecialista });
    if (!especialistaEliminado) return res.status(404).json({ error: 'Especialista no encontrado' });
    res.json({ mensaje: 'Especialista eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
