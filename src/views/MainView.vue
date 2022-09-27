<script setup lang="ts">
import {onBeforeMount, provide, reactive, ref} from 'vue'
import {onBeforeRouteUpdate, RouterView, useRoute} from 'vue-router'
import CommonHeader from '@/components/Common/CommonHeader.vue'
import CommonNavVue from '@/components/Common/CommonNav.vue'
import {Get} from "@/script/api";
import type {UserPermission} from "@/script/interface"
import {DefaultUserPermission} from "@/script/interface"
import router from "@/router";

const route = useRoute()
// 状态 key
const key = ref(0)
const loading = ref<boolean>(true)

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
const mids: number[] = reactive([])
const Permission: UserPermission = reactive(DefaultUserPermission)
provide('Permission', Permission)

// 页面加载前
onBeforeMount(async () => {
    // 获取用户信息
    await Get('/api/menu').then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            return rsp.data as MenuData
        }
    }).then((data) => {
        mids.push(...data.mids)
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
        //在庫閲覧
        if (data.mids.includes(11)) {
            Permission.StockView = true
        }
        //入出庫履歴
        if (data.mids.includes(12)) {
            Permission.StockRecord = true
        }
        //入出庫操作
        if (data.mids.includes(13)) {
            Permission.StockAction = true
        }
        //顧客閲覧
        if (data.mids.includes(14)) {
            Permission.CustomerView = true
        }
        //顧客編集
        if (data.mids.includes(15)) {
            Permission.CustomerEdit = true
        }
        //顧客新規
        if (data.mids.includes(16)) {
            Permission.CustomerAdd = true
        }
        // システム設定
        if (data.mids.includes(10)) {
            Permission.SystemSettings = true
        }
        Object.assign(empDto, data.empDto)
    }).catch((error) => console.error(error))
    // 判断权限
    if (route.meta.mid != 0 && !mids.includes(route.meta.mid)) {
        await router.push({name: 'NoPermission'})
        // 判断是否为异步页面
    } else if (!route.meta.needLoading) {
        loading.value = false
    }
})
// 路由更新前
onBeforeRouteUpdate((to) => {
    loading.value = true
    // 判断权限
    if (to.meta.mid != 0 && !mids.includes(to.meta.mid)) {
        router.push({name: 'NoPermission'})
        // 判断是否为异步页面
    } else if (!to.meta.needLoading) {
        loading.value = false
    }
})
</script>

<template>
    <CommonHeader v-bind="empDto"></CommonHeader>
    <CommonNavVue></CommonNavVue>
    <div v-show="!loading" class="mainCon">
        <router-view class="main" :key="key" @reload="key+=1" @loaded="loading = false">
        </router-view>
    </div>
    <div v-show="loading" class="loadingCon q-pa-md flex flex-center">
        <q-circular-progress indeterminate rounded size="70px" color="primary"/>
    </div>
</template>

<style lang="sass">
.mainCon
    background-color: #f6f6f6
    min-height: calc(100vh - 60px)
    margin-top: 60px
    margin-left: 260px

.loadingCon
    position: fixed
    top: 60px
    left: 260px
    right: 0
    height: 50vh
    z-index: 998

.main
    max-width: 1024px
    width: 90%
    margin: 0 auto
</style>
