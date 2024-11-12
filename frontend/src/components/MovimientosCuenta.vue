<template>
  <div>
    <h2>Movimientos de la Comunidad</h2>

    <!-- Formulario de Filtros -->
    <form @submit.prevent="filtrarMovimientos">
      <label>Fecha Inicio:</label>
      <input type="date" v-model="fechaInicio" />

      <label>Fecha Fin:</label>
      <input type="date" v-model="fechaFin" />

      <label>Tipo:</label>
      <select v-model="tipo">
        <option value="">Todos</option>
        <option value="ingreso">Ingreso</option>
        <option value="gasto">Gasto</option>
      </select>

      <label>Cuenta:</label>
      <select v-model="cuenta">
        <option value="">Ambas</option>
        <option value="banco">Banco</option>
        <option value="caja">Caja</option>
      </select>

      <button type="submit">Filtrar</button>
    </form>

    <!-- Lista de Movimientos -->
    <ul>
      <li v-for="mov in movimientos" :key="mov._id">
        {{ mov.fecha }} - {{ mov.concepto }} - {{ mov.importe }}€ ({{ mov.tipo }})
      </li>
    </ul>
    <p v-if="mensaje">{{ mensaje }}</p>
  </div>
</template>

  
  <script>
  import apiClient from '../apiClient';

export default {
  data() {
    return {
      movimientos: [],
      mensaje: '',
      fechaInicio: '',
      fechaFin: '',
      tipo: '',
      cuenta: ''
    };
  },
  async created() {
    await this.cargarMovimientos();
  },
  methods: {
    async cargarMovimientos() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.mensaje = 'Debes iniciar sesión para ver los movimientos.';
          return;
        }

        const response = await apiClient.get('/comunidades/movimientos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.movimientos = response.data;
      } catch (error) {
        this.mensaje = error.response?.data.message || "Error al cargar movimientos";
      }
    },
    async filtrarMovimientos() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.mensaje = 'Debes iniciar sesión para ver los movimientos.';
          return;
        }

        const response = await apiClient.get('/comunidades/movimientos', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            fechaInicio: this.fechaInicio,
            fechaFin: this.fechaFin,
            tipo: this.tipo,
            cuenta: this.cuenta
          }
        });
        this.movimientos = response.data;
      } catch (error) {
        this.mensaje = error.response?.data.message || "Error al filtrar movimientos";
      }
    }
  }
};

  </script>
  