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
