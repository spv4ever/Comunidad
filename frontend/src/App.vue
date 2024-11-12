<template>
  <div id="app">
    <!-- Header de navegación -->
    <header>
      <nav>
        <!-- Mostrar "Registro" e "Inicio de Sesión" solo si el usuario no está logado -->
        <router-link v-if="!isAuthenticated" to="/registro">Registro</router-link>
        <router-link v-if="!isAuthenticated" to="/login">Inicio de Sesión</router-link>
        
        <!-- Mostrar "Movimientos" y otros enlaces solo si el usuario está logado -->
        <router-link v-if="isAuthenticated" to="/movimientos">Movimientos</router-link>
        <router-link v-if="isAuthenticated" to="/balance">Balance</router-link>
        <router-link v-if="isAuthenticated" to="/agregar-movimiento">Agregar Movimiento</router-link>
        
        <!-- Mostrar el botón de "Cerrar Sesión" solo si el usuario está logado -->
        <button v-if="isAuthenticated" @click="cerrarSesion">Cerrar Sesión</button>
      </nav>
      <!-- Mostrar el nombre de la comunidad y un botón para refrescarlo -->
      <div v-if="isAuthenticated" class="comunidad-info">
        Comunidad: {{ comunidad }}
        
      </div>

    </header>

    <!-- Contenido principal -->
    <main>
      <router-view @loginSuccess="handleLoginSuccess" />
    </main>

    <!-- Footer opcional -->
    <footer>
      <p>&copy; 2023 Mi Aplicación de Comunidad</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      comunidad: ""
    };
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem("token"); // Devuelve true si el token existe, false si no
    }
  },
  created() {
    // Recuperar el nombre de la comunidad desde el almacenamiento local al cargar la aplicación
    this.comunidad = localStorage.getItem("comunidad") || "";
  },
  watch: {
    // Observa cambios en localStorage para actualizar el nombre de la comunidad
    '$route'() {
      this.comunidad = localStorage.getItem("comunidad") || "";
    }
  },
  methods: {
  actualizarComunidad() {
    this.comunidad = localStorage.getItem("comunidad") || "";
  },
  handleLoginSuccess() {
    this.actualizarComunidad();
  },
  cerrarSesion() {
    localStorage.removeItem("token"); // Eliminar el token
    localStorage.removeItem("comunidad"); // Eliminar el nombre de la comunidad
    this.comunidad = ""; // Limpiar el nombre de la comunidad en el estado
    this.$router.push("/login"); // Redirigir al usuario a la página de inicio de sesión
    setTimeout(() => {
      window.location.reload(); // Recargar la página después de la redirección
    }, 100); // Opcional: una pequeña espera para asegurar la redirección
  }
},
  
};
</script>

<style scoped>
/* Estilos generales */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  font-family: Arial, sans-serif;
  color: #333;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  
}

/* Header de navegación */
header {
  background-color: #b8cfe7;
  color: white;
  padding: 20px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
} 

nav {
  display: flex;
  gap: 15px;
}

router-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

router-link:hover {
  text-decoration: underline;
}

/* Estilo para el nombre de la comunidad */
.comunidad-info {
  color: black;
  font-style: italic;
  font-weight: bold;
}

/* Contenido principal */
main {
  flex: 1;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

/* Footer */
footer {
  background-color: #f1f1f1;
  color: #555;
  text-align: center;
  padding: 10px;
}
</style>