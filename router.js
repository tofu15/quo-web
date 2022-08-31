import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
import LoginView from '@/views/LoginView.vue'
import ResetPwView from '@/views/ResetPwView.vue'

import HomeView from '@/views/HomeView.vue'
import ProductListView from '@/views/Product/ListView.vue'
import ProductDetailView from '@/views/Product/DetailView.vue'
import ProductListseView from '@/views/Product/ListseView.vue'
// 系统设置
import NewUser from '@/views/System/NewUser.vue'
import Work from '@/views/System/Work.vue'


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
                        title: "ホームページ",
                        keepAlive: false
                    }
                },
                {
                    path: '/product/list',
                    name: 'product-list',
                    component: ProductListView,
                    meta: {
                        title: "製品一覧",
                        keepAlive: true
                    }
                },
                {
                    path: '/product/detail/:id',
                    name: 'product-detail',
                    component: ProductDetailView,
                    meta: {
                        title: "製品詳細情報",
                        keepAlive: false
                    }
                },
                {
                    path: '/product/listse',
                    name: 'product-listse',
                    component: ProductListseView,
                    meta: {
                        title: "シリーズ一覧",
                        keepAlive: true
                    }
                },
                {
                    path: '/system/newuser',
                    name: 'system-newuser',
                    component: NewUser,
                    meta: {
                        title: "新規ユーザー",
                        keepAlive: false
                    }
                },
                {
                    path: '/system/work',
                    name: 'system-work',
                    component: Work,
                    meta: {
                        title: "業務設定",
                        keepAlive: false
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

router.beforeResolve((to, from) => {
    document.title = to.meta.title ? to.meta.title : 'ホームページ';
})

export default router
