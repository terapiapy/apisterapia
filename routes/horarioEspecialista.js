const express = require('express');
const router = express.Router();
const HorarioEspecialista = require('../models/horarioespecialistaModel');
const Especialista = require('../models/especialistaModel'); // Para validar la relación

// Crear un nuevo horario para un especialista
router.post('/', async (req, res) => {
  const {idespecialista, dia, fecha, hora } = req.body;

  try {
    // Verificamos si el especialista existe
    const especialista = await Especialista.findById(idespecialista);
    if (!especialista) {
      return res.status(404).json({ error: 'Especialista no encontrado' });
    }

    const horario = new HorarioEspecialista({
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

//Obtener horario por especialista

router.get('/especialista/:idespecialista', async (req, res) => {
  const horarios = await HorarioEspecialista.find({ idespecialista: req.params.idespecialista })
      .populate('idespecialista', 'nombresespecialista apellidosespecialista');

  if (!horarios || horarios.length === 0) {
      return res.status(404).json({ error: 'No se encontraron horarios para este especialista' });
  }

  res.json(horarios);
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
router.get('/:_id', async (req, res) => {
  try {
    const horario = await HorarioEspecialista.findOne({ _id: req.params._id }).populate('idespecialista', 'nombresespecialista apellidosespecialista');
    if (!horario) return res.status(404).json({ error: 'Horario no encontrado' });
    res.json(horario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un horario (PUT)
router.put('/:id', async (req, res) => {
  const horarioActualizado = await HorarioEspecialista.findOneAndUpdate(
      { _id: req.params.id }, // Utilizamos _id para identificar el horario
      req.body,
      { new: true } // Devuelve el horario actualizado
  ).populate('idespecialista', 'nombresespecialista apellidosespecialista');

  if (!horarioActualizado) {
      return res.status(404).json({ error: 'Horario no encontrado' });
  }

  res.json(horarioActualizado);
});


// Eliminar un horario (DELETE)
router.delete('/:id', async (req, res) => {
  const horarioEliminado = await HorarioEspecialista.findOneAndDelete({ _id: req.params.id }); // Utilizamos _id para identificar el horario

  if (!horarioEliminado) {
      return res.status(404).json({ error: 'Horario no encontrado' });
  }

  res.json({ mensaje: 'Horario eliminado correctamente' });
});

module.exports = router;
