// 基础依赖
import {createRouter, createWebHistory} from 'vue-router'
import {Get} from "@/script/api";

import MainView from '@/views/MainView.vue'
import LoginView from '@/views/LoginView.vue'
import ResetPwView from '@/views/ResetPwView.vue'

import HomeView from '@/views/HomeView.vue'
import NoPermission from '@/views/NoPermission.vue'
import 'vue-router'

// 产品
import ProductListView from '@/views/Product/ListView.vue'
import ProductDetailView from '@/views/Product/DetailView.vue'
import ProductEditView from '@/views/Product/EditView.vue'
import ProductAddView from '@/views/Product/AddView.vue'
import ProductAddAllView from '@/views/Product/AddAllView.vue'
import ProductListseView from '@/views/Product/ListseView.vue'
import ProductEditseView from '@/views/Product/EditseView.vue'
import ProductAddseView from '@/views/Product/AddseView.vue'
// 个人设置
import SettingsProfile from '@/views/settings/Profile.vue'
import SettingsPasswd from '@/views/settings/Passwd.vue'
// 系统设置
import Work from '@/views/System/Work.vue'
import NewUser from '@/views/System/NewUser.vue'
import UserList from '@/views/System/UserList.vue'
import UserPer from '@/views/System/UserPer.vue'
import UserEdit from '@/views/System/UserEdit.vue'
// 顾客
import CustomerList from '@/views/Customer/List.vue'
import CustomerDetail from '@/views/Customer/Detail.vue'
import CustomerEdit from '@/views/Customer/Edit.vue'
import CustomerAdd from '@/views/Customer/Add.vue'
// 库存
import StockList from '@/views/Stock/List.vue'
import StockRecord from '@/views/Stock/Record.vue'
// 报价单
import QuoteList from '@/views/Quote/List.vue'
import QuoteAuditList from '@/views/Quote/AuditList.vue'
// 订单
import OrderList from '@/views/Order/List.vue'
import OrderOutList from '@/views/Order/OutList.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: {
                title: "ログイン",
                needLoading: false,
                mids: null
            }
        },
        {
            path: '/resetpw',
            name: 'resetpw',
            component: ResetPwView,
            meta: {
                title: "初期パスワード変更",
                needLoading: false,
                mids: null
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
                        needLoading: false,
                        mids: null
                    }
                },
                {
                    path: '/no-permission',
                    name: 'NoPermission',
                    component: NoPermission,
                    meta: {
                        title: "権限がありません",
                        needLoading: false,
                        mids: null
                    }
                },
                {
                    path: '/settings/profile',
                    name: 'settings-profile',
                    component: SettingsProfile,
                    meta: {
                        title: "個人情報",
                        needLoading: true,
                        mids: null
                    }
                },
                {
                    path: '/settings/passwd',
                    name: 'settings-passwd',
                    component: SettingsPasswd,
                    meta: {
                        title: "パスワード変更",
                        needLoading: false,
                        mids: null
                    }
                },
                {
                    path: '/product/list',
                    name: 'product-list',
                    component: ProductListView,
                    meta: {
                        title: "製品一覧",
                        needLoading: true,
                        mids: [1]
                    }
                },
                {
                    path: '/product/detail/:id',
                    name: 'product-detail',
                    component: ProductDetailView,
                    meta: {
                        title: "製品詳細情報",
                        needLoading: true,
                        mids: [1]
                    }
                },
                {
                    path: '/product/edit/:id',
                    name: 'product-edit',
                    component: ProductEditView,
                    meta: {
                        title: "製品情報編集",
                        needLoading: true,
                        mids: [2]
                    }
                },
                {
                    path: '/product/add',
                    name: 'product-add',
                    component: ProductAddView,
                    meta: {
                        title: "新規製品",
                        needLoading: true,
                        mids: [4]
                    }
                },
                {
                    path: '/product/addall',
                    name: 'product-addall',
                    component: ProductAddAllView,
                    meta: {
                        title: "新規製品一括インポート",
                        needLoading: false,
                        mids: [4]
                    }
                },
                {
                    path: '/product/listse',
                    name: 'product-listse',
                    component: ProductListseView,
                    meta: {
                        title: "シリーズ一覧",
                        needLoading: true,
                        mids: [6]
                    }
                },
                {
                    path: '/product/editse/:id',
                    name: 'product-editse',
                    component: ProductEditseView,
                    meta: {
                        title: "シリーズ編集",
                        needLoading: true,
                        mids: [7]
                    }
                },
                {
                    path: '/product/addse',
                    name: 'product-addse',
                    component: ProductAddseView,
                    meta: {
                        title: "新規シリーズ",
                        needLoading: true,
                        mids: [9]
                    }
                },
                {
                    path: '/system/permission',
                    name: 'system-per',
                    component: UserPer,
                    meta: {
                        title: "権限設定",
                        needLoading: true,
                        mids: [10]
                    }
                },
                {
                    path: '/system/newuser',
                    name: 'system-newuser',
                    component: NewUser,
                    meta: {
                        title: "新規ユーザー",
                        needLoading: true,
                        mids: [10]
                    }
                },
                {
                    path: '/system/user',
                    name: 'system-user',
                    component: UserList,
                    meta: {
                        title: "ユーザー管理",
                        needLoading: true,
                        mids: [10]
                    }
                },
                {
                    path: '/system/user/:id',
                    name: 'system-user-edit',
                    component: UserEdit,
                    meta: {
                        title: "ユーザー編集",
                        needLoading: true,
                        mids: [10]
                    }
                },
                {
                    path: '/system/work',
                    name: 'system-work',
                    component: Work,
                    meta: {
                        title: "業務設定",
                        needLoading: true,
                        mids: [10]
                    }
                },
                {
                    path: '/stock/list',
                    name: 'stock-list',
                    component: StockList,
                    meta: {
                        title: "在庫一覧",
                        needLoading: true,
                        mids: [11]
                    }
                },
                {
                    path: '/stock/record',
                    name: 'stock-record',
                    component: StockRecord,
                    meta: {
                        title: "入出庫履歴",
                        needLoading: true,
                        mids: [12]
                    }
                },
                {
                    path: '/customer/list',
                    name: 'customer-list',
                    component: CustomerList,
                    meta: {
                        title: "顧客一覧",
                        needLoading: true,
                        mids: [14, 15]
                    }
                },
                {
                    path: '/customer/detail/:id',
                    name: 'customer-detail',
                    component: CustomerDetail,
                    meta: {
                        title: "顧客詳細情報",
                        needLoading: true,
                        mids: [14, 15]
                    }
                },
                {
                    path: '/customer/edit/:id',
                    name: 'customer-edit',
                    component: CustomerEdit,
                    meta: {
                        title: "顧客編集",
                        needLoading: true,
                        mids: [16, 17]
                    }
                },
                {
                    path: '/customer/add',
                    name: 'customer-add',
                    component: CustomerAdd,
                    meta: {
                        title: "新規見込み顧客",
                        needLoading: false,
                        mids: [18]
                    }
                },
                {
                    path: '/quote/list',
                    name: 'quote-list',
                    component: QuoteList,
                    meta: {
                        title: "見積一覧",
                        needLoading: true,
                        mids: [22, 24]
                    }
                },
                {
                    path: '/quote/list/detail/:id',
                    name: 'quote-list-detail',
                    component: StockList,
                    meta: {
                        title: "見積詳細情報",
                        needLoading: true,
                        mids: [22, 24]
                    }
                },
                {
                    path: '/quote/audit',
                    name: 'quote-audit',
                    component: QuoteAuditList,
                    meta: {
                        title: "承認待ち見積書",
                        needLoading: true,
                        mids: [20, 21]
                    }
                },
                {
                    path: '/quote/audit/detail/:id',
                    name: 'quote-audit-detail',
                    component: StockList,
                    meta: {
                        title: "見積詳細情報",
                        needLoading: true,
                        mids: [20, 21]
                    }
                },
                {
                    path: '/quote/add',
                    name: 'quote-add',
                    component: HomeView,
                    meta: {
                        title: "見積作成",
                        needLoading: false,
                        mids: [24]
                    }
                },
                {
                    path: '/quote/edit/:id',
                    name: 'quote-edit',
                    component: StockList,
                    meta: {
                        title: "見積修正",
                        needLoading: true,
                        mids: [24]
                    }
                },
                {
                    path: '/order/list',
                    name: 'order-list',
                    component: OrderList,
                    meta: {
                        title: "注文一覧",
                        needLoading: true,
                        mids: [23, 24]
                    }
                },
                {
                    path: '/order/list/detail/:id',
                    name: 'order-list-detail',
                    component: StockList,
                    meta: {
                        title: "注文詳細情報",
                        needLoading: true,
                        mids: [23, 24]
                    }
                },
                {
                    path: '/order/out',
                    name: 'order-out',
                    component: OrderOutList,
                    meta: {
                        title: "出庫待ち注文",
                        needLoading: true,
                        mids: [19]
                    }
                },
                {
                    path: '/order/out/detail/:id',
                    name: 'order-out-detail',
                    component: StockList,
                    meta: {
                        title: "注文詳細情報",
                        needLoading: true,
                        mids: [19]
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

    let isToLogin = to.name == 'login'

    return Get('/api/islogin').then((rsp) => {
        if (rsp instanceof Error) {
            return false
        } else if (rsp.success) {
            if (isToLogin) {
                return {name: 'home'}
            } else {
                return true
            }
        } else {
            if (isToLogin) {
                return true
            } else {
                return {name: 'login'}
            }
        }
    })
})

router.beforeResolve((to) => {
    document.title = to.meta.title ? to.meta.title : 'ホームページ'
})

declare module 'vue-router' {
    interface RouteMeta {
        // 是可选的
        keepAlive?: boolean
        // 每个路由都必须声明
        title: string
        needLoading: boolean
        mids: number[] | null
    }
}

export default router
