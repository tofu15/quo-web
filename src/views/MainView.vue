<script setup>
import { RouterView } from 'vue-router'
import CommonHeader from '@/components/Common/CommonHeader.vue'
import CommonNavVue from '@/components/Common/CommonNav.vue';
</script>

<template>
    <CommonHeader></CommonHeader>
    <CommonNavVue></CommonNavVue>
    <RouterView class="main"></RouterView>
</template>

<style lang="sass">
</style>
