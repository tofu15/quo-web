<script setup>
import { reactive, computed, onBeforeMount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import CommonTable from '@/components/Common/CommonTable.vue';
import CommonModal from '@/components/Common/CommonModal.vue';
import router from '/router';
// header 参数
const headerProps = {
    title: 'シリーズ一覧',
    urls: [
        {
            text: 'ホーム',
            isUrl: true,
            url: '/'
        },
        {
            text: ' / 製品管理',
            isUrl: false,
            url: ''
        },
        {
            text: ' / シリーズ一覧',
            isUrl: false,
            url: ''
        }
    ]
}
// 调用后端接口 获取表格信息
onBeforeMount(async () => {
    let productseJson = await (await fetch('/api/product-series')).json()
    productseJson.data.forEach(element => {
        tableProps.data.push(element)
    })
})
// table 参数
const tableProps = reactive({
    data: [],
    headers: [
        {
            name: "ID",
            type: "number"
        },
        {
            name: "シリーズ名",
            type: "string"
        },
        {
            name: "タイプ",
            type: "type"
        },
        {
            name: "備考",
            type: "string"
        }
    ]
})
</script>
<template>
    <div>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <CommonTable v-bind="tableProps"></CommonTable>
    </div>
</template>
<style lang="sass" scoped>
</style>