<script setup lang="ts">
import CommonNavItemVue from './CommonNavItem.vue'
import {computed, inject} from "vue"
import type {UserPermission} from "@/script/interface"
import {DefaultUserPermission} from "@/script/interface"

const Permission = inject<UserPermission>('Permission', DefaultUserPermission)

interface item {
    moduleName: string
    url: string
    haveSub: boolean
    subs?: { name: string, url: string }[]
}

const items = computed<item[]>(() => {
    let items: item[] = []
    // 主页
    items.push({
        moduleName: 'ホーム',
        url: '/home',
        haveSub: false
    })
    // 产品
    let product: item = {
        moduleName: '製品管理',
        url: '/product',
        haveSub: true,
        subs: []
    }
    if (Permission.ProductView) {
        product.subs?.push({name: '製品一覧', url: '/list'})
    }
    if (Permission.ProductAdd) {
        product.subs?.push({name: '新規製品', url: '/add'}, {name: '新規製品一括インポート', url: '/addall'})
    }
    if (Permission.ProductPlan) {
        product.subs?.push({name: '生産計画確認申請承認', url: '/verify'})
    }
    if (Permission.ProductSeriesView) {
        product.subs?.push({name: 'シリーズ一覧', url: '/listse'})
    }
    if (Permission.ProductSeriesAdd) {
        product.subs?.push({name: '新規シリーズ', url: '/addse'})
    }
    if (product.subs?.length != 0) {
        items.push(product)
    }

    // 库存
    let stock: item = {
        moduleName: '在庫管理',
        url: '/stock',
        haveSub: true,
        subs: []
    }
    if (Permission.StockView) {
        stock.subs?.push({name: '在庫一覧', url: '/list'})
    }
    if (Permission.StockRecord) {
        stock.subs?.push({name: '入出庫履歴', url: '/record'})
    }
    if (stock.subs?.length != 0) {
        items.push(stock)
    }

    // 顾客
    let customer: item = {
        moduleName: '顧客管理',
        url: '/customer',
        haveSub: true,
        subs: []
    }
    if (Permission.CustomerView) {
        customer.subs?.push({name: '顧客一覧', url: '/list'})
    }
    if (Permission.CustomerAdd) {
        customer.subs?.push({name: '新規見込み顧客', url: '/add'})
    }
    if (customer.subs?.length != 0) {
        items.push(customer)
    }

    // todo
    // items.push(
    // {
    //     moduleName: '見積管理',
    //     url: '/estimate',
    //     haveSub: true,
    //     subs: [
    //         {name: '見積書一覧', url: '/list'},
    //         {name: '見積書作成', url: '/add'},
    //         {name: '承認待ち見積書', url: '/verify'}
    //     ]
    // },
    // {
    //     moduleName: '注文管理',
    //     url: '/order',
    //     haveSub: true,
    //     subs: [
    //         {name: '注文一覧', url: '/list'},
    //         {name: '出庫待ち注文', url: '/verify'}
    //     ]
    // },
    // {
    //     moduleName: 'データ分析',
    //     url: '/analysis',
    //     haveSub: false
    // }
    // )

    // 个人设置
    items.push(
        {
            moduleName: '個人設定',
            url: '/settings',
            haveSub: true,
            subs: [
                {name: '個人情報', url: '/profile'},
                {name: 'パスワード変更', url: '/passwd'}
            ]
        }
    )

    // 系统设置
    if (Permission.SystemSettings) {
        items.push({
            moduleName: 'システム設定',
            url: '/system',
            haveSub: true,
            subs: [
                {name: '新規ユーザー', url: '/newuser'},
                {name: 'ユーザー管理', url: '/user'},
                {name: '権限設定', url: '/permission'},
                {name: '業務設定', url: '/work'},
            ]
        })
    }

    return items
})
</script>

<template>
    <nav>
        <div>
            <CommonNavItemVue v-for="item in items" v-bind="item">
            </CommonNavItemVue>
        </div>
    </nav>
</template>

<style lang="sass" scoped>
nav
    overflow-y: auto
    user-select: none
    border-right: 1px solid rgb(217, 217, 217)
    position: fixed
    top: 60px
    left: 0
    bottom: 0
    width: 260px
    padding-top: 10px
</style>
