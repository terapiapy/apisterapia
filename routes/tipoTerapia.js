const express = require('express');
const router = express.Router();
const Tipoterapia = require('../models/tipoTerapiaModel');

// Crear un nuevo tipo de terapia (POST)
router.post('/', async (req, res) => {
  const { idtipo, tituloterapia, descripcion, procedimiento } = req.body;

  try {
    const tipoExistente = await Tipoterapia.findOne({ idtipo });

    if (tipoExistente) {
      return res.status(400).json({ error: 'El tipo de terapia ya está registrado' });
    }

    const tipoterapia = new Tipoterapia({
      idtipo,
      tituloterapia,
      descripcion,
      procedimiento
    });

    await tipoterapia.save();
    res.status(201).json({ message: 'Tipo de terapia creado con éxito' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los tipos de terapia (GET)
router.get('/', async (req, res) => {
  try {
    const tipoterapias = await Tipoterapia.find(); // Obtiene todos los tipos de terapia
    res.json(tipoterapias); // Devuelve el listado de tipos de terapia en formato JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un tipo de terapia por idtipo (GET)
router.get('/:idtipo', async (req, res) => {
  try {
    const tipoterapia = await Tipoterapia.findOne({ idtipo: req.params.idtipo });
    if (!tipoterapia) return res.status(404).json({ error: 'Tipo de terapia no encontrado' });
    res.json(tipoterapia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un tipo de terapia (PUT)
router.put('/:idtipo', async (req, res) => {
  try {
    const tipoterapiaActualizada = await Tipoterapia.findOneAndUpdate(
      { idtipo: req.params.idtipo },
      req.body,
      { new: true } // Devuelve el tipo de terapia actualizado
    );
    if (!tipoterapiaActualizada) return res.status(404).json({ error: 'Tipo de terapia no encontrado' });
    res.json(tipoterapiaActualizada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un tipo de terapia (DELETE)
router.delete('/:idtipo', async (req, res) => {
  try {
    const tipoterapiaEliminada = await Tipoterapia.findOneAndDelete({ idtipo: req.params.idtipo });
    if (!tipoterapiaEliminada) return res.status(404).json({ error: 'Tipo de terapia no encontrado' });
    res.json({ mensaje: 'Tipo de terapia eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
