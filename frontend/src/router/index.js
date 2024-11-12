import { createRouter, createWebHistory } from 'vue-router'; // Importa createRouter y createWebHistory
import RegisterPage from '../components/RegisterPage.vue';
import LoginPage from '../components/LoginPage.vue';
import MovimientosCuenta from '../components/MovimientosCuenta.vue';
import BalanceCuenta from '../components/BalanceCuenta.vue';
import AgregarMovimiento from '../components/AgregarMovimiento.vue';
import Bienvenida from '../components/Bienvenida.vue';

const routes = [
  { path: '/', redirect: '/login' }, // Redirige la raíz a /login o a cualquier otra ruta
  { path: '/agregar-movimiento', component: AgregarMovimiento },
  { path: '/registro', component: RegisterPage },
  { path: '/login', component: LoginPage },
  { path: '/movimientos', component: MovimientosCuenta },
  { path: '/balance', component: BalanceCuenta },
  { path: '/bienvenida', component: Bienvenida }, // Nueva ruta de bienvenida
  { path: '/:catchAll(.*)', redirect: '/login' } // Redirige cualquier ruta no encontrada a /login
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
