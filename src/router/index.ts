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
    {
      path: '/AdminSignup',
      name: 'admin-signup',
      component: () => import('../views/auth/AdminSignup.vue')
    },
    {
      path: '/AdminLogin',
      name: 'admin-login',
      component: () => import('../views/auth/AdminLogin.vue')
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
      },
      {
        path: 'properties',
        name: 'property',
        component: () => import('../views/agent/MyProperties.vue')
      },
      // Inside your routes array
      {
        path: '/properties/:id',
        name: 'property-detail',
        component: () => import('../views/agent/PropertyDetail.vue')
      },
      {
        path: '/properties/edit/:id',
        name: 'PropertyEdit',
        component: () => import('@/views/agent/PropertyEdit.vue')
      },
      {
        path: '/agent/requests',
        name: 'AgentRequests',
        component: () => import('@/views/agent/Requests.vue')
      },
      {
        path: '/agent/inspections',
        name: 'AgentInspections',
        component: () => import('@/views/agent/Inspections.vue')
      }
  ]
},
{
  path: '/customer',
  component: () => import('../layouts/CustomerLayout.vue'), 
  children: [
    {
      path: 'dashboard',
      component: () => import('../views/customer/Dashboard.vue')
    },
     {
        path: 'browse',
        name: 'customer-browse',
        component: () => import('../views/customer/browse.vue')
      },
      {
        path: '/customer/properties/:id',
        name: 'CustomerPropertyDetail',
        component: () => import('@/views/customer/PropertyDetail.vue')
      },
      {
        path: '/customer/saved/SavedProperties',
        name: 'CustomerSavedProperties',
        component: () => import('@/views/customer/saved/SavedProperties.vue')
      },
    
      {
        path: '/customer/request',
        name: 'CustomerRequest',
        component: () => import('@/views/customer/request.vue')
      },
      {
  path: '/customer/requests/:id',
  name: 'RequestDetail',
  component: () => import('@/views/customer/RequestDetail.vue')
},
      {
        path: '/customer/inspections',
        name: 'CustomerInspections',
        component: () => import('@/views/customer/inspections.vue')
      },
      // {
      //   path: '/properties/:id/request-inspection',
      //   name: 'request-inspection',
      //   component: () => import('@/views/RequestInspection.vue'),
      //   meta: { requiresAuth: true } // optional
      // },
      {
  path: '/customer/request-inspection/:id',
  name: 'request-inspection',
  component: () => import('@/views/customer/RequestInspection.vue')
}
      
    
  ]
},
{
  path: '/admin',
  component: () => import('../layouts/AdminLayout.vue'), 
  children: [
    {
      path: 'dashboard',
      component: () => import('../views/admin/dashboard.vue')
    },
    {
      path: 'properties',
      component: () => import('../views/admin/Properties.vue')
    },
    {
      path: 'Inspections',
      component: () => import('../views/admin/Inspections.vue')
    },
    {
      path: 'agents',
      component: () => import('../views/admin/agent/AgentManagement.vue')
    },
    {
      path: 'verifications',
      component: () => import('../views/admin/AgentVerification.vue')
    },
    {
      path: 'customers',
      component: () => import('../views/admin/customers.vue')
    },
    {
      path: 'requests',
      component: () => import('../views/admin/requests.vue')
    },
    {
      path: 'notifications',
      name: 'AdminNotifications',
      component: () => import('../views/admin/notifications.vue')
    },
    
  ]
}

  ]
})

export default router