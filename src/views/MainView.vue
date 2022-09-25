<script setup lang="ts">
import {KeepAlive, onBeforeMount, provide, reactive, ref} from 'vue'
import {RouterView} from 'vue-router'
import CommonHeader from '@/components/Common/CommonHeader.vue'
import CommonNavVue from '@/components/Common/CommonNav.vue'
import {Get} from "@/script/api";
import type {UserPermission} from "@/script/interface"
import {DefaultUserPermission} from "@/script/interface"
// 状态 key
const key = ref(0)

// 定义接口
interface MenuData {
    empDto: EmpDto
    mids: number[]
}

interface EmpDto {
    ename: string | null
    dname: string | null
    rname: string | null
}

// 用户名称和职位声明
const empDto: EmpDto = reactive({
    ename: null,
    dname: null,
    rname: null
})

// 注入用户权限信息
const Permission: UserPermission = reactive(DefaultUserPermission)
provide('Permission', Permission)

// 页面加载前 获取用户信息
onBeforeMount(async () => {
    await Get('/api/menu').then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            return rsp.data as MenuData
        }
    }).then((data) => {
        // 製品閲覧
        if (data.mids.includes(1)) {
            Permission.ProductView = true
        }
        // 製品編集
        if (data.mids.includes(2)) {
            Permission.ProductEdit = true
        }
        // 製品削除
        if (data.mids.includes(3)) {
            Permission.ProductDelete = true
        }
        // 新規製品
        if (data.mids.includes(4)) {
            Permission.ProductAdd = true
        }
        // 生産計画
        if (data.mids.includes(5)) {
            Permission.ProductPlan = true
        }
        // シリーズ一覧
        if (data.mids.includes(6)) {
            Permission.ProductSeriesView = true
        }
        // シリーズ編集
        if (data.mids.includes(7)) {
            Permission.ProductSeriesEdit = true
        }
        // シリーズ削除
        if (data.mids.includes(8)) {
            Permission.ProductSeriesDelete = true
        }
        // 新規シリーズ
        if (data.mids.includes(9)) {
            Permission.ProductSeriesAdd = true
        }
        // システム設定
        if (data.mids.includes(10)) {
            Permission.SystemSettings = true
        }
        Object.assign(empDto, data.empDto)
    }).catch((error) => console.error(error))
})
</script>

<template>
    <CommonHeader v-bind="empDto"></CommonHeader>
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
