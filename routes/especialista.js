const express = require('express');
const router = express.Router();
const Especialista = require('../models/especialistaModel');
const Tipoterapia = require('../models/tipoterapiaModel');
// 📌 Crear un nuevo especialista (POST)
router.post('/agregar', async (req, res) => {
  const { idtipo, nombresespecialista, apellidosespecialista, foto, especialidad, precio, rating, experiencia, biografia } = req.body;

  try {
    // Verificar que el idtipo sea válido
    const tipoterapiaExistente = await Tipoterapia.findById(idtipo);
    if (!tipoterapiaExistente) {
      return res.status(400).json({ error: 'El ID del tipo de terapia no es válido' });
    }

    // Verificar que el campo experiencia sea un número
    if (isNaN(experiencia)) {
      return res.status(400).json({ error: 'El campo experiencia debe ser un número' });
    }

    const especialista = new Especialista({
      idtipo,
      nombresespecialista,
      apellidosespecialista,
      foto,
      especialidad,
      precio,
      rating,
      experiencia,  // Asegúrate de que sea un número
      biografia
    });

    await especialista.save();
    res.status(201).json({ message: 'Especialista creado con éxito', especialista });

  } catch (error) {
    console.error(error); // Imprimir error para debug
    res.status(500).json({ error: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const especialistas = await Especialista.find().populate('idtipo', 'tituloterapia'); // Relación con Tipoterapia
    res.json(especialistas); // Aquí se devolverá la lista de especialistas con el campo 'tituloterapia' poblado
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Obtener un especialista por _id (GET)
router.get('/:id', async (req, res) => {
  try {
    const especialista = await Especialista.findById(req.params.id).populate('idtipo', 'tituloterapia');
    if (!especialista) return res.status(404).json({ error: 'Especialista no encontrado' });
    res.json(especialista); // Aquí se devuelve el especialista con 'tituloterapia' poblado
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Actualizar un especialista (PUT)
router.put('/:id', async (req, res) => {
  try {
    const especialistaActualizado = await Especialista.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!especialistaActualizado) return res.status(404).json({ error: 'Especialista no encontrado' });
    res.json(especialistaActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Eliminar un especialista (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const especialistaEliminado = await Especialista.findByIdAndDelete(req.params.id);
    if (!especialistaEliminado) return res.status(404).json({ error: 'Especialista no encontrado' });
    res.json({ mensaje: 'Especialista eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
