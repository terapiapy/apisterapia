const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploads');
const Tipoterapia = require('../models/tipoTerapiaModel');

// Crear un nuevo tipo de terapia (POST)
router.post('/agregar', upload.single('imagen'), async (req, res) => {
  try {
    const { tituloterapia, descripcion, procedimiento } = req.body;
    const imagen = req.file ? req.file.path : null;

    const tipoterapia = new Tipoterapia({
      tituloterapia,
      descripcion,
      procedimiento,
      imagen,
    });

    await tipoterapia.save();
    res.status(201).json({ message: 'Tipo de terapia creado con éxito', tipoterapia });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los tipos de terapia (GET)
router.get('/', async (req, res) => {
  try {
    const tipoterapias = await Tipoterapia.find();
    res.json(tipoterapias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('ID recibido:', id); // Debug

    // Validar si el ID tiene el formato correcto
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('❌ ID inválido');
      return res.status(400).json({ error: 'ID inválido' });
    }

    // Buscar el documento con el ObjectId
    const tipoterapia = await Tipoterapia.findById(id);
    console.log('Resultado de la búsqueda:', tipoterapia); // Debug

    if (!tipoterapia) {
      console.log('❌ Tipo de terapia no encontrado');
      return res.status(404).json({ error: 'Tipo de terapia no encontrado' });
    }

    res.status(200).json(tipoterapia);
  } catch (error) {
    console.error('❌ Error en la búsqueda:', error.message);
    res.status(500).json({ error: 'Error en el servidor', details: error.message });
  }
});

// Actualizar un tipo de terapia por _id (PUT)
router.put('/:_id', async (req, res) => {
  const tipoterapiaActualizada = await Tipoterapia.findByIdAndUpdate(
      req.params._id, // Utilizamos _id para coincidir con la ruta
      req.body,
      { new: true } // Devuelve el tipo de terapia actualizado
  );
  console.log(req.params._id);
      console.log(req.body);
  if (!tipoterapiaActualizada) {
      return res.status(404).json({ error: 'Tipo de terapia no encontrado' });
  }

  res.json(tipoterapiaActualizada);
});

// Actualizar solo la imagen de un tipo de terapia (PUT)
router.put('/actualizar-imagen/:_id', upload.single('imagen'), async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    // Verificar si se envió un archivo
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
    }

    const imagen = req.file.path;

    // Actualizar solo el campo imagen
    const tipoterapiaActualizada = await Tipoterapia.findByIdAndUpdate(
      id,
      { imagen },
      { new: true }
    );

    if (!tipoterapiaActualizada) {
      return res.status(404).json({ error: 'Tipo de terapia no encontrado' });
    }

    res.json({ message: 'Imagen actualizada correctamente', tipoterapia: tipoterapiaActualizada });
  } catch (error) {
    console.error('❌ Error al actualizar imagen:', error.message);
    res.status(500).json({ error: 'Error en el servidor', details: error.message });
  }
});



// Eliminar un tipo de terapia por _id (DELETE)
router.delete('/:_id', async (req, res) => {
  try {
    const tipoterapiaEliminada = await Tipoterapia.findByIdAndDelete(req.params._id);
    if (!tipoterapiaEliminada) return res.status(404).json({ error: 'Tipo de terapia no encontrado' });
    res.json({ mensaje: 'Tipo de terapia eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
