import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/collections',
            name: 'collections',
            component: () => import('../views/Collections.vue')
        },
        {
            path: '/tasks',
            name: 'tasks',
            component: () => import('../views/Tasks.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/Login.vue')
        },
        {
            path: '/signup',
            name: 'signup',
            component: () => import('../views/SignUp.vue')
        },
    ]
})

export default router
