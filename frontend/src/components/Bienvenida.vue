<template>
    <div>
      <h2>Bienvenido a la Comunidad, {{ comunidad }}</h2>
      <p>¡Nos alegra tenerte aquí! Explora las opciones del menú para ver tus movimientos y balance.</p>
    </div>
  </template>
  
  <script>
  export default {
    computed: {
      comunidad() {
        return localStorage.getItem("comunidad") || "";
      }
    }
  };
  </script>
  