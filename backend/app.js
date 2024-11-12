const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Comunidad = require('./models/Comunidad');
app.use(express.json());
const cors = require('cors');
require('dotenv').config();

// Configurar el secreto JWT y la URL de la base de datos
const JWT_SECRET = process.env.JWT_SECRET;
const DATABASE_URL = process.env.DATABASE_URL




app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080'], // Agrega los dominios permitidos aquí
  credentials: true, // Si necesitas habilitar las cookies en las solicitudes
}));

// Conexión a MongoDB
// Conectar a MongoDB
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Hola, mundo! Esta es tu primera ruta en Express.');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});

// Crear una nueva comunidad
app.post('/comunidades', async (req, res) => {
    try {
      const nuevaComunidad = new Comunidad(req.body);
      const resultado = await nuevaComunidad.save();
      res.status(201).json(resultado);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Obtener todas las comunidades
  app.get('/comunidades', async (req, res) => {
    try {
      const comunidades = await Comunidad.find();
      res.json(comunidades);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Registrar un movimiento en la cuenta de banco
  app.post('/comunidades/:id/banco', async (req, res) => {
    try {
      const comunidad = await Comunidad.findById(req.params.id);
      comunidad.banco.push(req.body);
      await comunidad.save();
      res.json(comunidad);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Registrar un movimiento en la cuenta de caja
  app.post('/comunidades/:id/caja', async (req, res) => {
    try {
      const comunidad = await Comunidad.findById(req.params.id);
      comunidad.caja.push(req.body);
      await comunidad.save();
      res.json(comunidad);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });


  // Ruta de registro
  app.post('/registro', async (req, res) => {
    const { nombre, nombreUsuario, contraseña } = req.body;
    try {
      const existeUsuario = await Comunidad.findOne({ nombreUsuario });
      if (existeUsuario) return res.status(400).json({ message: 'El nombre de usuario ya existe.' });
  
      const nuevaComunidad = new Comunidad({ nombre, nombreUsuario, contraseña });
      await nuevaComunidad.save();
      res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  

// Ruta de inicio de sesión
app.post('/login', async (req, res) => {
    const { nombreUsuario, contraseña } = req.body;
    try {
        // Buscar el usuario en la base de datos
        const usuario = await Comunidad.findOne({ nombreUsuario });
        if (!usuario) return res.status(400).json({ message: 'Usuario no encontrado.' });

        // Verificar la contraseña
        const esContraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!esContraseñaValida) return res.status(400).json({ message: 'Contraseña incorrecta.' });

        // Generar un token JWT
        const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Incluir el nombre de la comunidad en la respuesta
        res.json({ 
            message: 'Inicio de sesión exitoso.', 
            token, 
            comunidadNombre: usuario.nombre // Asegúrate de que este campo existe en el esquema de usuario
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

  
  
  const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    // console.log("Token recibido:", token); // Verifica el token en la consola
  
    if (!token) return res.status(401).json({ message: 'Acceso denegado. No hay token proporcionado.' });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("Error de verificación:", err.message); // Verifica el error
        return res.status(401).json({ message: 'Token inválido.' });
      }
      req.usuarioId = decoded.id;
      next();
    });
  };

  // Obtener todas las comunidades (ruta protegida)
app.get('/comunidades', verificarToken, async (req, res) => {
    try {
      const comunidades = await Comunidad.find();
      res.json(comunidades);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Ruta para borrar un usuario (comunidad) específico
app.delete('/comunidades/:id', verificarToken, async (req, res) => {
    try {
      const comunidad = await Comunidad.findById(req.params.id);
  
      // Verificar si el usuario autenticado coincide con el usuario que desea eliminar
      if (comunidad._id.toString() !== req.usuarioId) {
        return res.status(403).json({ message: 'Acceso denegado: no puedes eliminar este usuario.' });
      }
  
      await Comunidad.findByIdAndDelete(req.params.id);
      res.json({ message: 'Usuario eliminado exitosamente.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.get('/comunidades/:id/movimientos', verificarToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { cuenta, tipo, fechaInicio, fechaFin } = req.query;
  
      const comunidad = await Comunidad.findById(id);
      if (!comunidad) return res.status(404).json({ message: 'Comunidad no encontrada.' });
  
      // Verificar si el usuario autenticado es el dueño de la comunidad
      if (comunidad._id.toString() !== req.usuarioId) {
        return res.status(403).json({ message: 'Acceso denegado.' });
      }
  
      // Seleccionar la cuenta (banco o caja)
      let movimientos = comunidad[cuenta];
      if (!movimientos) return res.status(400).json({ message: 'Cuenta no válida. Debe ser "banco" o "caja".' });
  
      // Aplicar filtro por tipo
      if (tipo) {
        movimientos = movimientos.filter(mov => mov.tipo === tipo);
      }
  
      // Aplicar filtro por fecha
      if (fechaInicio || fechaFin) {
        const inicio = fechaInicio ? new Date(fechaInicio) : new Date('1970-01-01');
        const fin = fechaFin ? new Date(fechaFin) : new Date();
        movimientos = movimientos.filter(mov => mov.fecha >= inicio && mov.fecha <= fin);
      }
  
      res.json(movimientos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.get('/comunidades/:id/balance', verificarToken, async (req, res) => {
    try {
      const { id } = req.params;
  
      const comunidad = await Comunidad.findById(id);
      if (!comunidad) return res.status(404).json({ message: 'Comunidad no encontrada.' });
  
      // Verificar si el usuario autenticado es el dueño de la comunidad
      if (comunidad._id.toString() !== req.usuarioId) {
        return res.status(403).json({ message: 'Acceso denegado.' });
      }
  
      // Calcular balance para cada cuenta
      const calcularBalance = (movimientos) => {
        let ingresos = 0;
        let gastos = 0;
        movimientos.forEach((mov) => {
          if (mov.tipo === 'ingreso') {
            ingresos += mov.importe;
          } else if (mov.tipo === 'gasto') {
            gastos += mov.importe;
          }
        });
        return {
          ingresos: ingresos.toFixed(2),
          gastos: gastos.toFixed(2),
          balance: (ingresos - gastos).toFixed(2)
        };
      };
  
      const balanceBanco = calcularBalance(comunidad.banco);
      const balanceCaja = calcularBalance(comunidad.caja);
  
      res.json({
        banco: balanceBanco,
        caja: balanceCaja
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

app.get('/comunidades/movimientos', verificarToken, async (req, res) => {
  try {
    const { fechaInicio, fechaFin, tipo, cuenta } = req.query;

    // Obtener la comunidad del usuario autenticado
    const comunidad = await Comunidad.findById(req.usuarioId);
    if (!comunidad) return res.status(404).json({ message: 'Comunidad no encontrada.' });

    // Obtener los movimientos de la cuenta especificada (banco o caja)
    let movimientos = [];
    if (cuenta === 'banco') {
      movimientos = comunidad.banco;
    } else if (cuenta === 'caja') {
      movimientos = comunidad.caja;
    } else {
      movimientos = [...comunidad.banco, ...comunidad.caja];
    }

    // Filtro por tipo de movimiento
    if (tipo) {
      movimientos = movimientos.filter(mov => mov.tipo === tipo);
    }

    // Filtro por rango de fechas
    if (fechaInicio || fechaFin) {
      const inicio = fechaInicio ? new Date(fechaInicio) : new Date('1970-01-01');
      const fin = fechaFin ? new Date(fechaFin) : new Date();
      movimientos = movimientos.filter(mov => {
        const fechaMovimiento = new Date(mov.fecha);
        return fechaMovimiento >= inicio && fechaMovimiento <= fin;
      });
    }

    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ message: 'Error al cargar movimientos' });
  }
});

app.get('/comunidades/balance', verificarToken, async (req, res) => {
    try {
      const comunidad = await Comunidad.findById(req.usuarioId);
      if (!comunidad) return res.status(404).json({ message: 'Comunidad no encontrada.' });
  
      const calcularBalance = (movimientos) => {
        let ingresos = 0;
        let gastos = 0;
        movimientos.forEach(mov => {
          if (mov.tipo === 'ingreso') {
            ingresos += mov.importe;
          } else if (mov.tipo === 'gasto') {
            gastos += mov.importe;
          }
        });
        return {
          ingresos: ingresos.toFixed(2),
          gastos: gastos.toFixed(2),
          balance: (ingresos - gastos).toFixed(2)
        };
      };
  
      const balanceBanco = calcularBalance(comunidad.banco);
      const balanceCaja = calcularBalance(comunidad.caja);
  
      res.json({ banco: balanceBanco, caja: balanceCaja });
    } catch (error) {
      res.status(500).json({ message: 'Error al calcular el balance' });
    }
  });
  app.post('/comunidades/movimientos', verificarToken, async (req, res) => {
    const { fecha, concepto, importe, informacionAdicional, tipo, cuenta } = req.body;
  
    try {
      // Encuentra la comunidad del usuario autenticado
      const comunidad = await Comunidad.findById(req.usuarioId);
      if (!comunidad) return res.status(404).json({ message: 'Comunidad no encontrada.' });
  
      // Crear un nuevo movimiento
      const nuevoMovimiento = { fecha, concepto, importe, informacionAdicional, tipo };
  
      // Agregar el movimiento a la cuenta correspondiente
      if (cuenta === 'banco') {
        comunidad.banco.push(nuevoMovimiento);
      } else if (cuenta === 'caja') {
        comunidad.caja.push(nuevoMovimiento);
      } else {
        return res.status(400).json({ message: 'Cuenta inválida. Debe ser "banco" o "caja".' });
      }
  
      // Guardar los cambios
      await comunidad.save();
      res.status(201).json({ message: 'Movimiento agregado exitosamente.', movimiento: nuevoMovimiento });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  