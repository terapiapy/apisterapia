require('dotenv').config();  // Esto carga las variables de entorno desde el archivo .env

const express = require('express');
const mongoose = require('mongoose');
const personasRoutes = require('./routes/persona'); // Ruta de Persona
const usuariosRoutes = require('./routes/usuario'); // Ruta de Usuario
const especialistasRoutes= require('./routes/especialista'); //Ruta de Especialista
const tipoTerapiasRoutes= require('./routes/tipoTerapia'); //Ruta tipoTerapias
const horariosEpecialistasRoutes= require('./routes/horarioEspecialista'); //Rutas de horarios
const salasRoutes= require('./routes/sala'); //Rutas de Sala
const sesionRoutes= require('./routes/sesion'); //Rutas de sesion
const reservasRoutes= require('./routes/reserva'); //Rutas de Reserva
const app = express();
const port = process.env.PORT || 3000;  // Usamos el puerto de la variable de entorno, si está disponible

// Middleware
app.use(express.json());

// Conexión a MongoDB usando la variable de entorno
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conexión exitosa a MongoDB Atlas');
}).catch(err => {
  console.error('Error al conectar con MongoDB:', err);
});

// El uso de Rutas
app.use('/api/personas', personasRoutes);
app.use('/api/usuarios', usuariosRoutes); 
app.use('/api/especialistas', especialistasRoutes); 
app.use('/api/tipoterapias', tipoTerapiasRoutes);
app.use('/api/horarios', horariosEpecialistasRoutes); 
app.use('/api/salas', salasRoutes);
app.use('/api/sesiones', sesionRoutes);
app.use('/api/reservas', reservasRoutes);
// Manejador global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal' });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en https://apisterapia.onrender.com`);
});
