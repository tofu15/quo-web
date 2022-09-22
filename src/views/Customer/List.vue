<script setup lang="ts">
import {onBeforeMount, reactive} from 'vue'
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import CommonTable from '@/components/Common/CommonTable.vue';
import {Get} from "@/script/api";

const emit = defineEmits(['reload'])
// header 参数
const headerProps = {
    title: '顧客一覧',
    urls: [
        {
            text: 'ホーム',
            isUrl: true,
            url: '/'
        },
        {
            text: ' / 顧客管理',
            isUrl: false,
            url: ''
        },
        {
            text: ' / 顧客一覧',
            isUrl: false,
            url: ''
        }
    ]
}

// 定义 Cus 接口
interface Cus {
    cid: number
    cname: string
    ctype: string
    contact: string
    ename: string
    csource: string
    ftime: string
}

// 定义 table 参数接口
interface TableProps {
    data: Cus[]
    headers: Object[]
    action: object
}

// table 参数
const tableProps: TableProps = reactive({
    data: [],
    headers: [
        {
            name: "顧客番号",
            type: "number"
        },
        {
            name: "会社名",
            type: "string"
        },
        {
            name: "顧客タイプ",
            type: "type"
        },
        {
            name: "担当者",
            type: "string"
        },
        {
            name: "作成者",
            type: "type"
        },
        {
            name: "ソース",
            type: "string"
        },
        {
            name: "フォロー日付",
            type: "date"
        }
    ],
    action: {
        view: "all",
        edit: "all"
    }
})

// 调用后端接口 获取表格信息
onBeforeMount(() => {
    Get('/api/customer').then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            return rsp.data as Cus[]
        }
    }).then((data) => {
        tableProps.data.push(...data)
    }).catch((error) => console.log(error))
})
</script>

<template>
    <div class="tableCon">
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <CommonTable
            @view="(id) => $router.push({ name: 'customer-detail', params: { id: id } })"
            @edit="(id) => $router.push({ name: 'customer-edit', params: { id: id } })"
            v-bind="tableProps"></CommonTable>
    </div>
</template>

<style lang="sass" scoped>
div.tableCon
    max-width: 1400px
</style>