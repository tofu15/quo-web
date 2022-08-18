<script setup>
import CommonNavItemVue from './CommonNavItem.vue';

const MAINMODULE = ['ホーム', '製品管理', '在庫管理', '見積管理', '注文管理', '顧客管理', 'データ分析', 'システム設定']

let items = [
    {
        moduleName: 'ホーム',
        url: '/',
        haveSub: false
    },
    {
        moduleName: '製品管理',
        url: '/product',
        haveSub: true,
        subs: [
            { name: '製品一覧', url: '/list' },
            { name: '新規製品', url: '/add' },
            { name: '新規製品一括インポート', url: '/addall' },
            { name: '生産計画確認申請承認', url: '/verify' },
            { name: 'シリーズ一覧', url: '/listse' },
            { name: '新規シリーズ', url: '/addse' }
        ]
    },
    {
        moduleName: '在庫管理',
        url: '/product',
        haveSub: true,
        subs: [
            { name: '製品一覧', url: '/li' },
            { name: '新規製品', url: '/add' },
            { name: '新規製品一括インポート', url: '/addall' },
            { name: '生産計画確認申請承認', url: '/verify' },
            { name: 'シリーズ一覧', url: '/listse' },
            { name: '新規シリーズ', url: '/addse' }
        ]
    },
    {
        moduleName: '見積管理',
        url: '/product',
        haveSub: false
    },
    {
        moduleName: '注文管理',
        url: '/product',
        haveSub: false
    },
    {
        moduleName: '顧客管理',
        url: '/product',
        haveSub: false
    },
    {
        moduleName: 'データ分析',
        url: '/product',
        haveSub: false
    },
    {
        moduleName: '個人設定',
        url: '/product',
        haveSub: false
    },
    {
        moduleName: 'システム設定',
        url: '/product',
        haveSub: false
    }
]
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
    user-select: none
    border-right: 1px solid rgb(217, 217, 217)
    position: fixed
    top: 60px
    left: 0
    bottom: 0
    width: 260px
    padding-top: 10px
</style>
