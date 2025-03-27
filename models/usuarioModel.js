const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Esquema de Usuario
const UsuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  idusuario: { type: Number, required: true, unique: true },
  nombreusuario: { type: String, required: true },
});

// Encriptar la contraseña antes de guardar (si es nueva o modificada)
UsuarioSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Método para comparar la contraseña durante el inicio de sesión
UsuarioSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Usuario', UsuarioSchema, 'usuario');
