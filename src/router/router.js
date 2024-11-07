
import { createRouter, createWebHistory } from "vue-router";
import Auth from "@/pages/auth/Auth.vue";
import Profile from "@/pages/profile/Profile.vue";
import Constructor from "@/pages/characters/Constructor.vue";
import CharactersPage from "@/pages/characters/CharactersPage.vue";
import Spells from "@/pages/spells/Spells.vue";
import Weapons from "@/pages/weapons/Weapons.vue";
import RoomList from "@/pages/room/RoomList.vue";
import Room from "@/pages/room/Room.vue";
import Register from "@/pages/auth/Register.vue";


const routes = [
    {
        path: '/auth',
        component: Auth,
        name: 'Auth'
    },
    {
        path: '/register',
        component: Register,
        name: 'Register'
    },
    {
        path: '/profile',
        component: Profile,
        name: 'Profile'
    },
    {
        path: '/characters',
        component: CharactersPage,
        name: 'CharactersPage'
    },
    {
        path: '/constructor',
        component: Constructor,
        name: 'Constructor'
    },
    {
        path: '/spells',
        component: Spells,
        name: 'Spells',
        props: (route) => ({
            ...route.params,
            ...route.query,
        }),
    },
    {
        path: '/weapons',
        component: Weapons,
        name: 'Weapons',
        props: (route) => ({
            ...route.params,
            ...route.query,
        }),
    },

    {
        path: '/room/:id',
        name: 'Room',
        component: Room,
    },
    {
        path: '/room',
        name: 'RoomList',
        component: RoomList,
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