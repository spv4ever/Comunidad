const bcrypt = require('bcryptjs');

async function generarContraseña() {
  const salt = await bcrypt.genSalt(10);
  const contraseñaEncriptada = await bcrypt.hash('nuevaContraseña', salt);
  console.log('Contraseña encriptada:', contraseñaEncriptada);
}

generarContraseña();