<script setup>
import { RouterView } from 'vue-router'
import CommonHeader from '@/components/Common/CommonHeader.vue'
import CommonNavVue from '@/components/Common/CommonNav.vue';
</script>

<template>
    <CommonHeader></CommonHeader>
    <CommonNavVue></CommonNavVue>
    <div class="mainCon">
        <RouterView class="main"></RouterView>
    </div>
</template>

<style lang="sass">
.mainCon
    background-color: #f6f6f6
    min-height: calc( 100vh - 60px)
    margin-top: 60px
    margin-left: 260px

.main
    max-width: 1024px
    width: 90%
    margin: 0 auto
</style>
