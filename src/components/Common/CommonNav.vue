<script setup>
import CommonNavItemVue from './CommonNavItem.vue';

let item = {
    moduleName: 'ログイン',
    url: '/login',
    haveSub: false
}
</script>

<template>
    <nav>
        <div>
            <CommonNavItemVue v-bind="item">
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
