<script setup lang="ts">
import {KeepAlive, ref} from 'vue'
import {RouterView} from 'vue-router'
import CommonHeader from '@/components/Common/CommonHeader.vue'
import CommonNavVue from '@/components/Common/CommonNav.vue'

const key = ref(0)
</script>

<template>
    <CommonHeader></CommonHeader>
    <CommonNavVue></CommonNavVue>
    <div class="mainCon">
        <router-view v-if="$route.meta.keepAlive" class="main" :key="key" @reload="key+=1" v-slot="{ Component }">
            <keep-alive>
                <component :is="Component"/>
            </keep-alive>
        </router-view>
        <router-view class="main" :key="key" @reload="key+=1" v-else>
        </router-view>
    </div>
</template>

<style lang="sass">
.mainCon
    background-color: #f6f6f6
    min-height: calc(100vh - 60px)
    margin-top: 60px
    margin-left: 260px

.main
    max-width: 1024px
    width: 90%
    margin: 0 auto
</style>
