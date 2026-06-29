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

    },
   {
  path: '/agent/verification',
  name: 'agent-verification',
  component: () => import('../views/agent/AgentVerification.vue')
},
    

    
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
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/auth/SignupView.vue')
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/auth/ForgotPasswordView.vue')
    },
    {
      path: '/SignupForm',
      name: 'signupform',
      component: () => import('@/views/auth/SignupForm.vue')
    },
    // {
    //   path: '/customer/dashboard',
    //   name: 'Customer Dashboard',
    //   component: () => import ('@/views/customer/Dashboard.vue')
    // },
    
    {
      path: '/reset-password',
      name: 'Reset Password',
      component: () => import ('@/views/auth/ResetPasswordView.vue')
    },
    // router/index.js
{
  path: '/agent',
  component: () => import('../layouts/AgentLayout.vue'), 
  children: [
    {
      path: 'dashboard',
      component: () => import('../views/agent/Dashboard.vue')
    },
    {
        path: 'verification',
        name: 'agent-verification',
        component: () => import('../views/agent/AgentVerification.vue')
      },
      {
        path: 'add-property',
        name: 'add-new-property',
        component: () => import('../views/agent/AddNewProperty.vue')
      }
  ]
}
  ]
})

export default router