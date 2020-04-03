import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Navbar from '../views/layouts/Navbar.vue'
import Daily from '../views/Daily.vue'
import Input from '../views/Input.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'


Vue.use(VueRouter)

const routes = [{
        path: '/login',
        name: 'login',
        components: { default: Login }

    },
    {
        path: '/register',
        name: 'register',
        components: { default: Register },
        // meta: {
        //     requiresAuth: true
        // }
    },
    {
        path: '/daily',
        name: 'daily',
        components: { default: Daily, header: Navbar },
        // meta: {
        //     requiresAuth: true
        // }
    },
    {
        path: '/input',
        name: 'input',
        components: { default: Input, header: Navbar },
        // meta: {
        //     requiresAuth: true
        // }
    },





]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: routes
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters.isLoggedIn) {
            next()
            return
        }
        next('/login')
    } else {
        next()
    }
})

export default router