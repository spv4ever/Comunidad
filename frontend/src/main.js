
console.log(import.meta.env); // Esto debería mostrar todas las variables de entorno, incluyendo VITE_API_URL

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(router);
app.mount('#app');



