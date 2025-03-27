const express = require('express');
const router = express.Router();
const HorarioEspecialista = require('../models/horarioespecialistaModel');
const Especialista = require('../models/especialistaModel'); // Para validar la relación

// Crear un nuevo horario para un especialista
router.post('/', async (req, res) => {
  const { idhorario, idespecialista, dia, fecha, hora } = req.body;

  try {
    // Verificamos si el especialista existe
    const especialista = await Especialista.findById(idespecialista);
    if (!especialista) {
      return res.status(404).json({ error: 'Especialista no encontrado' });
    }

    const horario = new HorarioEspecialista({
      idhorario,
      idespecialista,
      dia,
      fecha,
      hora
    });

    await horario.save();
    res.status(201).json({ message: 'Horario de especialista creado con éxito' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los horarios de los especialistas
router.get('/', async (req, res) => {
  try {
    const horarios = await HorarioEspecialista.find().populate('idespecialista', 'nombresespecialista apellidosespecialista');
    res.json(horarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un horario por idhorario
router.get('/:idhorario', async (req, res) => {
  try {
    const horario = await HorarioEspecialista.findOne({ idhorario: req.params.idhorario }).populate('idespecialista', 'nombresespecialista apellidosespecialista');
    if (!horario) return res.status(404).json({ error: 'Horario no encontrado' });
    res.json(horario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un horario (PUT)
router.put('/:idhorario', async (req, res) => {
  try {
    const horarioActualizado = await HorarioEspecialista.findOneAndUpdate(
      { idhorario: req.params.idhorario },
      req.body,
      { new: true } // Devuelve el horario actualizado
    ).populate('idespecialista', 'nombresespecialista apellidosespecialista');

    if (!horarioActualizado) return res.status(404).json({ error: 'Horario no encontrado' });
    res.json(horarioActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un horario (DELETE)
router.delete('/:idhorario', async (req, res) => {
  try {
    const horarioEliminado = await HorarioEspecialista.findOneAndDelete({ idhorario: req.params.idhorario });
    if (!horarioEliminado) return res.status(404).json({ error: 'Horario no encontrado' });
    res.json({ mensaje: 'Horario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
