const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploads');
const Especialista = require('../models/especialistaModel');
const Tipoterapia = require('../models/tipoTerapiaModel');
// 📌 Crear un nuevo especialista (POST) con foto subida a Cloudinary
router.post('/agregar', upload.single('foto'), async (req, res) => {
  try {
    const { idtipo, nombresespecialista, apellidosespecialista, especialidad, precio, rating, experiencia, biografia, foto } = req.body;
    
    // Verificar que el idtipo sea válido
    const tipoterapiaExistente = await Tipoterapia.findById(idtipo);
    if (!tipoterapiaExistente) {
      return res.status(400).json({ error: 'El ID del tipo de terapia no es válido' });
    }

    // Verificar que el campo experiencia sea un número
    if (isNaN(experiencia)) {
      return res.status(400).json({ error: 'El campo experiencia debe ser un número' });
    }

    // Manejar la foto subida
    const fotoUrl = req.file ? req.file.path : null;

    const especialista = new Especialista({
      idtipo,
      nombresespecialista,
      apellidosespecialista,
      foto, // Guardamos la URL de Cloudinary
      especialidad,
      precio,
      rating,
      experiencia,
      biografia
    });

    await especialista.save();
    res.status(201).json({ message: 'Especialista creado con éxito', especialista });

  } catch (error) {
    console.error('❌ Error al crear especialista:', error.message);
    res.status(500).json({ error: error.message });
  }
});

//Metodo para hacer busqueda por nombres, apellidos, tituloterapia, especialidad o precio
//uso GET http://localhost:3000/api/especialistas/buscar?especialidad=Psicología&precio=150

router.get('/buscar', async (req, res) => {
  const { nombresespecialista, apellidosespecialista, tituloterapia, especialidad, precio } = req.query;

  let filtro = {};
  if (nombresespecialista) filtro.nombresespecialista = nombresespecialista;
  if (apellidosespecialista) filtro.apellidosespecialista = apellidosespecialista;
  if (especialidad) filtro.especialidad = especialidad;
  if (precio) filtro.precio = precio;

  // Realizar la consulta con los filtros definidos
  const especialistas = await Especialista.find(filtro).populate('idtipo', 'tituloterapia');
  res.json(especialistas);
});

//Muestra un listado de especialistas sin filtros 
router.get('/', async (req, res) => {
  try {
    const especialistas = await Especialista.find().populate('idtipo', 'tituloterapia'); // Relación con Tipoterapia
    res.json(especialistas); // Aquí se devolverá la lista de especialistas con el campo 'tituloterapia' poblado
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Obtener un especialista por _id (GET)
router.get('/porid/:id', async (req, res) => {
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

// 📌 Actualizar solo la foto de un especialista (PUT)
router.put('/actualizar-foto/:id', upload.single('foto'), async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea válido
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    // Verificar que se haya subido una nueva foto
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ninguna foto' });
    }

    const nuevaFoto = req.file.path; // URL de Cloudinary

    // Actualizar solo el campo foto
    const especialistaActualizado = await Especialista.findByIdAndUpdate(
      id,
      { foto: nuevaFoto },
      { new: true }
    );

    if (!especialistaActualizado) {
      return res.status(404).json({ error: 'Especialista no encontrado' });
    }

    res.json({ message: 'Foto actualizada correctamente', especialista: especialistaActualizado });

  } catch (error) {
    console.error('❌ Error al actualizar foto:', error.message);
    res.status(500).json({ error: 'Error en el servidor', details: error.message });
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
