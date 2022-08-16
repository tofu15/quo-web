<script setup>
import CommonNavItemVue from './CommonNavItem.vue';
</script>

<template>
    <nav>
        <div>
            <CommonNavItemVue moduleName="製品管理" :haveSub="true" :subs="['製品一覧', '新規製品', '新規製品一括インポート']">
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
