
import { createRouter, createWebHistory } from "vue-router";
import Auth from "@/components/auth/Auth.vue";
import Profile from "@/components/profile/Profile.vue";
import Constructor from "@/components/constructor/Constructor.vue";


const routes = [
    {
        path: '/auth',
        component: Auth,
        name: 'Auth'
    },
    {
        path: '/profile',
        component: Profile,
        name: 'Profile'
    },
    {
        path: '/constructor',
        component: Constructor,
        name: 'Constructor'
    },
]

const router = createRouter({
    routes,
    history: createWebHistory(),
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('jwt')
    if (token === "null" && to.meta.requiresAuth) {
        next('/login')
    } else {
        next()
    }
})


export default router;