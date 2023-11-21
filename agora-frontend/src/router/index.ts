import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const routes = [
  {
    path: '/',
    name: 'home',
  },
  {
    path: '/rtmhome',
    name: 'rtmhome',
  },
  {
    path: '/videocall',
    name: 'videocall-room',
  },
  {
    path: '/live-audience',
    name: 'live-audience-room',
  },
  {
    path: '/live',
    name: 'live-room',
  },
  {
    path: '/test',
    name: 'test-room',
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
  },
];

const newRoutes = routes.map((route) => {
  return {
    ...route,
    component: () => import(`../views/${route.name}.vue`),
  };
});

const router = createRouter({
  history: createWebHistory('/'),
  routes: newRoutes,
});

// router.beforeEach((to, from, next) => {
//   if (store.getters.isAuth) {
//     if (sessionStorage.getItem('token')) {
//       if (to.name === 'home') return next({ name: from.name });
//       next();
//     } else {
//       store.commit('removeToken');
//       next({ name: 'home' });
//     }
//   } else {
//     if (to.name === 'login') return next();
//     next({ name: 'home' });
//   }
// });

export default router;
