<template>
    <div>
      <h2>Lista de Comunidades</h2>
      <ul>
        <li v-for="comunidad in comunidades" :key="comunidad._id">
          {{ comunidad.nombre }} - Usuario: {{ comunidad.nombreUsuario }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import apiClient from '../apiClient';
  
  export default {
    data() {
      return {
        comunidades: [] // Almacena las comunidades obtenidas de la API
      };
    },
    async created() {
      try {
        const response = await apiClient.get('/comunidades'); // Llama a la API para obtener comunidades
        console.log("Datos recibidos:", response.data); // Verifica los datos recibidos en la consola
        this.comunidades = response.data; // Guarda los datos en la variable
      } catch (error) {
        console.error("Error al obtener las comunidades:", error);
      }
    }
  };
  </script>
  