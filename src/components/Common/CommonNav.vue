<script setup lang="ts">
import CommonNavItemVue from './CommonNavItem.vue';

const MAINMODULE = ['ホーム', '製品管理', '在庫管理', '見積管理', '注文管理', '顧客管理', 'データ分析', 'システム設定']

let items = [
    {
        moduleName: 'ホーム',
        url: '/home',
        haveSub: false
    },
    {
        moduleName: '製品管理',
        url: '/product',
        haveSub: true,
        subs: [
            {name: '製品一覧', url: '/list'},
            {name: '新規製品', url: '/add'},
            {name: '新規製品一括インポート', url: '/addall'},
            {name: '生産計画確認申請承認', url: '/verify'},
            {name: 'シリーズ一覧', url: '/listse'},
            {name: '新規シリーズ', url: '/addse'}
        ]
    },
    {
        moduleName: '在庫管理',
        url: '/stock',
        haveSub: true,
        subs: [
            {name: '在庫一覧', url: '/list'},
            {name: '入出庫記入', url: '/record'},
            {name: '入出庫履歴', url: '/history'}
        ]
    },
    {
        moduleName: '見積管理',
        url: '/estimate',
        haveSub: true,
        subs: [
            {name: '見積書一覧', url: '/list'},
            {name: '見積書作成', url: '/add'},
            {name: '承認待ち見積書', url: '/verify'}
        ]
    },
    {
        moduleName: '注文管理',
        url: '/order',
        haveSub: true,
        subs: [
            {name: '注文一覧', url: '/list'},
            {name: '出庫待ち注文', url: '/verify'}
        ]
    },
    {
        moduleName: '顧客管理',
        url: '/client',
        haveSub: true,
        subs: [
            {name: '顧客一覧', url: '/list'},
            {name: '新規見込み顧客', url: '/add'}
        ]
    },
    {
        moduleName: 'データ分析',
        url: '/analysis',
        haveSub: false
    },
    {
        moduleName: '個人設定',
        url: '/settings',
        haveSub: true,
        subs: [
            {name: '個人情報', url: '/profile'},
            {name: 'パスワード変更', url: '/pwd'}
        ]
    },
    {
        moduleName: 'システム設定',
        url: '/system',
        haveSub: true,
        subs: [
            {name: '新規ユーザー', url: '/newuser'},
            {name: 'ユーザー管理', url: '/user'},
            {name: '権限設定', url: '/permission'},
            {name: '業務設定', url: '/work'},
        ]
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
