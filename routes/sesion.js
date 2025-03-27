const express = require('express');
const router = express.Router();
const Sesion = require('../models/sesionModel');

// Crear una nueva sesión
router.post('/', async (req, res) => {
  const { idsesion, idsala, idespecialista, idpersona, descripcionsesion, estadosesion, idhorario } = req.body;

  try {
    const sesion = new Sesion({
      idsesion,
      idsala,
      idespecialista,
      idpersona,
      descripcionsesion,
      estadosesion,
      idhorario
    });

    await sesion.save();
    res.status(201).json({ message: 'Sesión creada con éxito' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las sesiones
router.get('/', async (req, res) => {
  try {
    const sesiones = await Sesion.find().populate('idsala', 'descripcion estatus') // Relacionar la colección Sala
      .populate('idespecialista', 'nombresespecialista apellidosespecialista') // Relacionar la colección Especialista
      .populate('idpersona', 'nombres apellidos') // Relacionar la colección Persona
      .populate('idhorario', 'dia hora'); // Relacionar la colección Horario

    res.json(sesiones); // Devuelve el listado de sesiones en formato JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una sesión por id
router.get('/:idsesion', async (req, res) => {
  try {
    const sesion = await Sesion.findOne({ idsesion: req.params.idsesion })
      .populate('idsala', 'descripcion')
      .populate('idespecialista', 'nombresespecialista apellidosespecialista')
      .populate('idpersona', 'nombres apellidos')
      .populate('idhorario', 'dia hora');
    
    if (!sesion) return res.status(404).json({ error: 'Sesión no encontrada' });
    res.json(sesion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una sesión
router.put('/:idsesion', async (req, res) => {
  try {
    const sesionActualizada = await Sesion.findOneAndUpdate(
      { idsesion: req.params.idsesion },
      req.body,
      { new: true } // Devuelve la sesión actualizada
    );

    if (!sesionActualizada) return res.status(404).json({ error: 'Sesión no encontrada' });
    res.json(sesionActualizada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar una sesión
router.delete('/:idsesion', async (req, res) => {
  try {
    const sesionEliminada = await Sesion.findOneAndDelete({ idsesion: req.params.idsesion });
    if (!sesionEliminada) return res.status(404).json({ error: 'Sesión no encontrada' });
    res.json({ mensaje: 'Sesión eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
