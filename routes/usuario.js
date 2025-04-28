const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploads');
const Usuario = require('../models/usuarioModel');
const jwt = require('jsonwebtoken'); // Para generar el token de autenticación

// Ruta para crear un nuevo usuario (Registro)
router.post('/register', async (req, res) => {
  const { email, password, nombreusuario } = req.body;
  console.log('Estamos en registro');
  try {
    const usuarioExistente = await Usuario.findOne({ email });

    if (usuarioExistente) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    const usuario = new Usuario({
      email,
      password,
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
      { id: usuario._id,
        email: usuario.email,
        nombreusuario: usuario.nombreusuario,
        nombre: usuario.nombres,
        apellido: usuario.apellidos,
        cedula: usuario.cedula,
        sexo: usuario.sexo,
        fechanacimiento: usuario.fechanacimiento,
        foto: usuario.fotousuario,
      },
      process.env.JWT_SECRET, // Aquí puedes cambiar la clave secreta para firmar el JWT
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      token,
      id: usuario._id,
      email: usuario.email,
      nombreusuario: usuario.nombreusuario,
      cedula: usuario.cedula,
      nombre: usuario.nombres,
      apellido: usuario.apellidos,
      sexo: usuario.sexo,
      fechanacimiento: usuario.fechanacimiento,
      foto: usuario.fotousuario
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//Metódo para  completar datos de registro 

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
router.get('/:_id', async (req, res) => {
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

// Actualizar datos personales del usuario
router.put('/update/:id', async (req, res) => {
  console.log('🚀 Se recibió una petición PUT para actualizar usuario con ID:', req.params.id);
  try {
    const { id } = req.params; // Aquí era _id, pero debe ser id porque tu ruta es '/update/:id'
    const {
      nombres,
      apellidos,
      cedula,
      fechanacimiento,
      sexo,
      email // El email puede ser opcional
    } = req.body;

    const updateData = {
      ...(nombres && { nombres }),
      ...(apellidos && { apellidos }),
      ...(cedula && { cedula }),
      ...(fechanacimiento && { fechanacimiento }),
      ...(sexo && { sexo }),
      ...(email && { email })
    };

    const usuarioActualizado = await Usuario.findByIdAndUpdate(id, { $set: updateData }, { new: true });

    if (!usuarioActualizado) {
      console.log('❌ Usuario no encontrado');
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    console.log('✅ Usuario actualizado con éxito:', usuarioActualizado);
    res.status(200).json({ message: 'Usuario actualizado con éxito', usuario: usuarioActualizado });
  } catch (error) {
    console.error('🔥 Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
});


// Actualizar o agregar la foto del usuario
router.put('/updatefoto/:_id', upload.single('fotousuario'), async (req, res) => {
  console.log('📸 Se recibió una petición PUT para agregar o actualizar foto de usuario con _ID:', req.params._id);
  
  try {
    const { _id } = req.params;

    // Validar el ID
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    // Verificar si se subió un archivo
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
    }

    const fotousuario = req.file.path; // Ruta del archivo subido

    // Buscar al usuario
    const usuario = await Usuario.findById(_id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si el campo 'fotousuario' ya tiene una foto, la reemplazamos. Si no, la agregamos.
    usuario.fotousuario = fotousuario;

    // Guardamos el usuario actualizado
    await usuario.save();

    res.json({ message: 'Foto de usuario actualizada correctamente', usuario });
  } catch (error) {
    console.error('🔥 Error al actualizar la foto del usuario:', error.message);
    res.status(500).json({ error: 'Error en el servidor', details: error.message });
  }
});



module.exports = router;
