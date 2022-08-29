<script setup>
import { reactive, computed, onBeforeMount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import CommonTable from '@/components/Common/CommonTable.vue';
import CommonModal from '@/components/Common/CommonModal.vue';
import router from '/router';
// header 参数
const headerProps = {
    title: '製品一覧',
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
            text: ' / 製品一覧',
            isUrl: false,
            url: ''
        }
    ]
}
// 调用后端接口 获取表格信息
onBeforeMount(async () => {
    let productsJson = await (await fetch('/api/product')).json()
    productsJson.data.forEach(element => {
        tableProps.data.push(element)
    })
})
// table 参数
const tableProps = reactive({
    data: [],
    headers: [
        {
            name: "製品番号",
            type: "number"
        },
        {
            name: "製品名",
            type: "string"
        },
        {
            name: "タイプ",
            type: "type"
        },
        {
            name: "シリーズ",
            type: "type"
        },
        {
            name: "単価",
            type: "number",
            decimal: true
        },
        {
            name: "在庫数",
            type: "number"
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