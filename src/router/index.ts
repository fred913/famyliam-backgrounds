import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/fs',
      name: 'fullscreen',
      component: HomeView,
      props: {
        fullscreen: true
      }
    },
  ],
})

export default router
