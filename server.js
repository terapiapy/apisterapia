require('dotenv').config();  
const express = require('express');
const mongoose = require('mongoose');


const usuariosRoutes = require('./routes/usuario'); 
const especialistasRoutes = require('./routes/especialista'); 
const tipoTerapiasRoutes = require('./routes/tipoTerapia'); 
const horariosEspecialistasRoutes = require('./routes/horarioEspecialista'); 
const salasRoutes = require('./routes/sala'); 
const sesionRoutes = require('./routes/sesion'); 
const reservasRoutes = require('./routes/reserva'); 

const app = express();
const port = process.env.PORT || 3000;  

// Middleware
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Conectado a la base de datos 'apisterapia'");
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos', error);
  });

// Rutas
try {

  app.use('/api/usuarios', usuariosRoutes);
  app.use('/api/especialistas', especialistasRoutes);
  app.use('/api/tipoterapias', tipoTerapiasRoutes);
  app.use('/api/horarios', horariosEspecialistasRoutes);
  app.use('/api/salas', salasRoutes);
  app.use('/api/sesiones', sesionRoutes);
  app.use('/api/reservas', reservasRoutes);
} catch (error) {
  console.error('❌ Error al cargar las rutas:', error);
}

// Ruta raíz
app.get('/', (req, res) => {
  res.send('🚀 API Terapia en funcionamiento 🚀');
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal' });
});

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en https://apisterapia.onrender.com`);
  //console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
