import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/states',
      name: 'states',
      component: () => import('../views/StatesView.vue')

    }
    // {
    //   path: '/properties',
    //   name: 'properties',
    //   component: () => import('../views/PropertiesView.vue')
    // },
    // {
    //   path: '/states',
    //   name: 'states',
    //   component: () => import('../views/StatesView.vue')
    // },
    // {
    //   path: '/for-agents',
    //   name: 'for-agents',
    //   component: () => import('../views/ForAgentsView.vue')
    // },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: () => import('../views/auth/LoginView.vue')
    // },
    // {
    //   path: '/signup',
    //   name: 'signup',
    //   component: () => import('../views/auth/SignupView.vue')
    // }
  ]
})

export default router