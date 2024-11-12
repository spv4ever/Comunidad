<template>
    <h2>Agregar Nuevo Movimiento</h2>
    <div class="form-container">
      <form @submit.prevent="agregarMovimiento">
        <label>Fecha:</label>
        <input type="date" v-model="fecha" required />
  
        <label>Concepto:</label>
        <input type="text" v-model="concepto" required />
  
        <label>Importe (€):</label>
        <input type="number" v-model="importe" step="0.01" required />
  
        <label>Información Adicional:</label>
        <input type="text" v-model="informacionAdicional" />
  
        <label>Tipo:</label>
        <select v-model="tipo" required>
          <option value="ingreso">Ingreso</option>
          <option value="gasto">Gasto</option>
        </select>
  
        <label>Cuenta:</label>
        <select v-model="cuenta" required>
          <option value="banco">Banco</option>
          <option value="caja">Caja</option>
        </select>
  
        <button type="submit">Agregar Movimiento</button>
      </form>
      <p v-if="mensaje">{{ mensaje }}</p>
    </div>
  </template>
  
  <script>
  import apiClient from '../apiClient';
  
  export default {
    data() {
      return {
        fecha: '',
        concepto: '',
        importe: 0,
        informacionAdicional: '',
        tipo: 'ingreso',
        cuenta: 'banco',
        mensaje: ''
      };
    },
    methods: {
      async agregarMovimiento() {
        try {
          const token = localStorage.getItem('token');
          const response = await apiClient.post('/comunidades/movimientos', {
            fecha: this.fecha,
            concepto: this.concepto,
            importe: this.importe,
            informacionAdicional: this.informacionAdicional,
            tipo: this.tipo,
            cuenta: this.cuenta
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.mensaje = response.data.message;
          // Limpiar el formulario
          this.fecha = '';
          this.concepto = '';
          this.importe = 0;
          this.informacionAdicional = '';
          this.tipo = 'ingreso';
          this.cuenta = 'banco';
        } catch (error) {
          this.mensaje = error.response?.data.message || "Error al agregar el movimiento";
        }
      }
    }
  };
  </script>
  

  <style scoped>
  /* Estilos para centrar el formulario */
  .form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    /*height: 100vh; /* Hace que el contenedor ocupe toda la altura de la pantalla */
  }
  
  form {
    display: flex;
    flex-direction: column; /* Hace que los elementos estén en una columna */
    gap: 10px; /* Añade espacio entre cada elemento */
    width: 300px; /* Ancho del formulario */
  }
  
  input,
  button {
    padding: 10px;
    font-size: 16px;
  }
  
  </style>