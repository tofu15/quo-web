import {createRouter, createWebHistory} from 'vue-router'
import MainView from '@/views/MainView.vue'
import LoginView from '@/views/LoginView.vue'
import ResetPwView from '@/views/ResetPwView.vue'

import HomeView from '@/views/HomeView.vue'
import 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        // 是可选的
        keepAlive?: boolean
        // 每个路由都必须声明
        title: string
    }
}

// 产品
import ProductListView from '@/views/Product/ListView.vue'
import ProductDetailView from '@/views/Product/DetailView.vue'
import ProductEditView from '@/views/Product/EditView.vue'
import ProductAddView from '@/views/Product/AddView.vue'
import ProductAddAllView from '@/views/Product/AddAllView.vue'

import ProductListseView from '@/views/Product/ListseView.vue'
import ProductEditseView from '@/views/Product/EditseView.vue'
import ProductAddseView from '@/views/Product/AddseView.vue'
// 系统设置
import NewUser from '@/views/System/NewUser.vue'
import Work from '@/views/System/Work.vue'
import UserList from '@/views/System/UserList.vue'
import UserEdit from '@/views/System/UserEdit.vue'


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
                    path: '/product/edit/:id',
                    name: 'product-edit',
                    component: ProductEditView,
                    meta: {
                        title: "製品情報編集",
                        keepAlive: false
                    }
                },
                {
                    path: '/product/add',
                    name: 'product-add',
                    component: ProductAddView,
                    meta: {
                        title: "新規製品",
                        keepAlive: false
                    }
                },
                {
                    path: '/product/addall',
                    name: 'product-addall',
                    component: ProductAddAllView,
                    meta: {
                        title: "新規製品一括インポート",
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
                    path: '/product/editse/:id',
                    name: 'product-editse',
                    component: ProductEditseView,
                    meta: {
                        title: "シリーズ編集",
                        keepAlive: false
                    }
                },
                {
                    path: '/product/addse',
                    name: 'product-addse',
                    component: ProductAddseView,
                    meta: {
                        title: "新規シリーズ",
                        keepAlive: false
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
                    path: '/system/user',
                    name: 'system-user',
                    component: UserList,
                    meta: {
                        title: "ユーザー管理",
                        keepAlive: true
                    }
                },
                {
                    path: '/system/user/:id',
                    name: 'system-user-edit',
                    component: UserEdit,
                    meta: {
                        title: "ユーザー編集",
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

router.beforeEach(async (to) => {
    if (to.name == 'resetpw') {
        return true
    }

    let result

    let isToLogin = to.name == 'login'


    await fetch('/api/islogin').then((response) => {
        if (!response.ok) {
            throw new Error("HTTP status " + response.status);
        }
        return response.json()
    }).then((json) => {
        if (json.success) {
            if (isToLogin) {
                result = {name: 'home'}
            } else {
                result = true
            }
        } else {
            if (isToLogin) {
                result = true
            } else {
                result = {name: 'login'}
            }
        }
    }).catch(() => {
        result = false
    })
    return result
})

router.beforeResolve((to) => {
    document.title = to.meta.title ? to.meta.title : 'ホームページ'
})

export default router
