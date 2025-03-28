const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuarioModel');
const jwt = require('jsonwebtoken'); // Para generar el token de autenticación

// Ruta para crear un nuevo usuario (Registro)
router.post('/register', async (req, res) => {
  const { email, password, idusuario, nombreusuario } = req.body;
  console.log('Estamos en registro');
  try {
    const usuarioExistente = await Usuario.findOne({ email });

    if (usuarioExistente) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    const usuario = new Usuario({
      email,
      password,
      idusuario,
      nombreusuario
    });

    await usuario.save();
    res.status(201).json({ message: 'Usuario creado con éxito' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para iniciar sesión (login)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const esValido = await usuario.matchPassword(password);

    if (!esValido) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET, // Aquí puedes cambiar la clave secreta para firmar el JWT
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find(); // Obtiene todos los usuarios
    res.json(usuarios); // Devuelve el listado de usuarios en formato JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un usuario por idusuario
router.get('/:idusuario', async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ idusuario: req.params.idusuario });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un usuario por email
router.get('/email/:email', async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ email: req.params.email });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
