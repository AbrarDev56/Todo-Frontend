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
            path: '/:collection_detail',
            name: 'collection_detail',
            component: () => import('../views/CollectionDetailView.vue')
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
