import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/components/Login.vue'
import ResetPwView from '@/components/ResetPw.vue'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/login',
            name: 'login',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: LoginView
        },
        {
            path: '/resetpw',
            name: 'resetpw',
            component: ResetPwView
        }
    ]
})

async function loginAuth(to, form) {
    if (to.name == 'resetpw') {
        return true
    }
    let isToLogin = to.name == 'login'
    let json = await (await fetch('/api/islogin')).json()
    if (json.isLogin && isToLogin) {
        return { name: 'home' }
    } else if (!json.isLogin && isToLogin) {
        return true
    } else if (json.isLogin && !isToLogin) {
        return true
    } else if (!json.isLogin && !isToLogin) {
        return { name: 'login' }
    }
}

router.beforeEach(router.beforeEach(loginAuth))

export default router
