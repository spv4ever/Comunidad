console.log("Variables de entorno:", import.meta.env);

import axios from 'axios';

console.log(import.meta.env.VITE_API_URL); // Debe imprimir la URL o undefined
console.log(import.meta.env); // Muestra todas las variables de entorno cargadas

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://comunidad-de6g.onrender.com", // Usa la URL fija si no se carga la variable
});


export default apiClient;


