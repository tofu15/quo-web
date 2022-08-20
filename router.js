import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
import LoginView from '@/views/LoginView.vue'
import ResetPwView from '@/views/ResetPwView.vue'

import HomeView from '@/views/HomeView.vue'
import ProductListView from '@/views/Product/ListView.vue'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: {
                title: "ログイン"
            }
        },
        {
            path: '/resetpw',
            name: 'resetpw',
            component: ResetPwView,
            meta: {
                title: "初期パスワード変更"
            }
        },
        {
            path: '/',
            redirect: '/home',
            name: 'main',
            component: MainView,
            children: [
                {
                    path: '/home',
                    name: 'home',
                    component: HomeView,
                    meta: {
                        title: "ホームページ"
                    }
                },
                {
                    path: '/product/list',
                    name: 'product-list',
                    component: ProductListView,
                    meta: {
                        title: "製品一覧"
                    }
                }
            ]
        }
    ]
})

async function beforeAuth(to, form) {
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

router.beforeEach(router.beforeEach(beforeAuth))

router.afterEach((to, from) => {
    document.title = to.meta.title ? to.meta.title : 'ホームページ';
})

export default router
