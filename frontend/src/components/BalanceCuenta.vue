<template>
    <div>
      <h2>Resumen de Balance</h2>
      <div v-if="balance">
        <h3>Cuenta de Banco</h3>
        <p>Ingresos: {{ balance.banco.ingresos }}€</p>
        <p>Gastos: {{ balance.banco.gastos }}€</p>
        <p>Balance: {{ balance.banco.balance }}€</p>
  
        <h3>Cuenta de Caja</h3>
        <p>Ingresos: {{ balance.caja.ingresos }}€</p>
        <p>Gastos: {{ balance.caja.gastos }}€</p>
        <p>Balance: {{ balance.caja.balance }}€</p>
      </div>
      <p v-else>{{ mensaje }}</p>
    </div>
  </template>
  
  <script>
  import apiClient from '../apiClient';
  
  export default {
    data() {
      return {
        balance: null,
        mensaje: ''
      };
    },
    async created() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.mensaje = 'Debes iniciar sesión para ver el balance.';
          return;
        }
  
        const response = await apiClient.get('/comunidades/balance', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.balance = response.data;
      } catch (error) {
        this.mensaje = error.response?.data.message || "Error al cargar el balance";
      }
    }
  };
  </script>
  