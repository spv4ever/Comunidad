<template>
  <h2>Inicio de Sesión</h2>
    <div class="form-container">
      <form @submit.prevent="login">
        <input v-model="nombreUsuario" placeholder="Nombre de Usuario" required />
        <input v-model="contraseña" type="password" placeholder="Contraseña" required />
        <button type="submit">Iniciar Sesión</button>
      </form>
      <p v-if="mensaje">{{ mensaje }}</p>
    </div>
  </template>
  
  <script>
  import apiClient from '../apiClient';
  
  export default {
    data() {
      return {
        nombreUsuario: '',
        contraseña: '',
        mensaje: ''
      };
    },
    created() {
      if (localStorage.getItem('token')) {
        this.$router.push('/bienvenida'); // Redirige al usuario autenticado a la página de bienvenida
      }
    },
    methods: {
      async login() {
        try {
          const response = await apiClient.post('/login', {
            nombreUsuario: this.nombreUsuario,
            contraseña: this.contraseña
          });
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('comunidad', response.data.comunidadNombre); // Guarda el nombre de la comunidad
          // Emite el evento loginSuccess para notificar al componente padre
          this.$emit('loginSuccess');

          // Redirige a la página principal o de bienvenida
          this.$router.push('/bienvenida').then(() => {
          window.location.reload();
          });

        } catch (error) {
          this.mensaje = error.response?.data.message || "Error en el inicio de sesión";
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