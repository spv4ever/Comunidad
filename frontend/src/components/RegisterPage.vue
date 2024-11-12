<template>
    <div>
      <h2>Registro</h2>
      <form @submit.prevent="register">
        <input v-model="nombre" placeholder="Nombre" required />
        <input v-model="nombreUsuario" placeholder="Nombre de Usuario" required />
        <input v-model="contraseña" type="password" placeholder="Contraseña" required />
        <button type="submit">Registrar</button>
      </form>
      <p v-if="mensaje">{{ mensaje }}</p>
    </div>
  </template>
  
  <script>
  import apiClient from '../apiClient';
  
  export default {
    data() {
      return {
        nombre: '',
        nombreUsuario: '',
        contraseña: '',
        mensaje: ''
      };
    },
    methods: {
      async register() {
        try {
          const response = await apiClient.post('/registro', {
            nombre: this.nombre,
            nombreUsuario: this.nombreUsuario,
            contraseña: this.contraseña
          });
          this.mensaje = response.data.message;
        } catch (error) {
          this.mensaje = error.response?.data.message || "Error en el registro";
        }
      }
    }
  };
  </script>
  