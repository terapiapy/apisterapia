const express = require('express');
const router = express.Router();
const Sesion = require('../models/sesionModel');

// Crear una nueva sesión
router.post('/', async (req, res) => {
  const { idreserva, descripcionsesion, estadosesion, linkdellamada, resena, evaluacion } = req.body;

  try {
      const nuevaSesion = new Sesion({
          idreserva, // Relación con la reserva
          descripcionsesion,
          estadosesion,
          linkdellamada, // Campo obligatorio
          resena: resena || '', // Campo opcional con valor por defecto
          evaluacion: evaluacion || undefined, // Campo opcional
      });

      await nuevaSesion.save();
      res.status(201).json({ message: 'Sesión creada con éxito', sesion: nuevaSesion });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});
// Obtener sesiones por usuario
router.get('/usuario/:idusuario', async (req, res) => {
  try {
      const idusuario = req.params.idusuario;

      // Buscar sesiones pasadas y próximas basadas en el estado
      const sesionesPasadas = await Sesion.find({ estadosesion: { $in: ['finalizado', 'cancelado'] } })
          .populate({
              path: 'idreserva',
              match: { idusuario }, // Filtrar por usuario en la reserva
              populate: [
                  { path: 'idusuario', select: 'nombres apellidos' },
                  { path: 'idespecialista', select: 'nombresespecialista apellidosespecialista' },
                  { path: 'idhorario', select: 'dia hora' },
              ],
          });

      const sesionesProximas = await Sesion.find({ estadosesion: 'habilitado' })
          .populate({
              path: 'idreserva',
              match: { idusuario }, // Filtrar por usuario en la reserva
              populate: [
                  { path: 'idusuario', select: 'nombres apellidos' },
                  { path: 'idespecialista', select: 'nombresespecialista apellidosespecialista' },
                  { path: 'idhorario', select: 'dia hora' },
              ],
          });

      res.json({ sesionesPasadas, sesionesProximas });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Obtener todas las sesiones
router.get('/', async (req, res) => {
  try {
      const sesiones = await Sesion.find()
          .populate({
              path: 'idreserva',
              populate: [
                  { path: 'idusuario', select: 'nombres apellidos' },
                  { path: 'idespecialista', select: 'nombresespecialista apellidosespecialista' },
                  { path: 'idhorario', select: 'dia hora' },
              ],
          });

      res.json(sesiones);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Obtener una sesión por id
router.get('/:id', async (req, res) => {
  try {
      const sesion = await Sesion.findById(req.params.id)
          .populate({
              path: 'idreserva',
              populate: [
                  { path: 'idusuario', select: 'nombres apellidos' },
                  { path: 'idespecialista', select: 'nombresespecialista apellidosespecialista' },
                  { path: 'idhorario', select: 'dia hora' },
              ],
          });

      if (!sesion) return res.status(404).json({ error: 'Sesión no encontrada' });

      res.json(sesion);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Actualizar una sesión
router.put('/:id', async (req, res) => {
  const { estadosesion, resena, evaluacion } = req.body;

  try {
      const actualizacion = {};
      if (estadosesion) actualizacion.estadosesion = estadosesion;
      if (resena) actualizacion.resena = resena;
      if (evaluacion) actualizacion.evaluacion = evaluacion;

      const sesionActualizada = await Sesion.findByIdAndUpdate(req.params.id, actualizacion, { new: true });

      if (!sesionActualizada) return res.status(404).json({ error: 'Sesión no encontrada' });

      res.json(sesionActualizada);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Eliminar una sesión
router.delete('/:id', async (req, res) => {
  try {
      const sesionEliminada = await Sesion.findByIdAndDelete(req.params.id);

      if (!sesionEliminada) return res.status(404).json({ error: 'Sesión no encontrada' });

      res.json({ mensaje: 'Sesión eliminada correctamente' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});



module.exports = router;
