<script setup lang="ts">
import {inject, onBeforeMount, reactive} from 'vue'
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import CommonTable from '@/components/Common/CommonTable.vue';
import {Get} from "@/script/api";
import type {TableProps, UserPermission} from "@/script/interface"
import {DefaultUserPermission} from "@/script/interface"
import {useQuasar} from "@modules/quasar";

const $q = useQuasar()
const Permission = inject<UserPermission>('Permission', DefaultUserPermission)
const emit = defineEmits(['loaded'])
// header 参数
const headerProps = {
    title: '入出庫履歴',
    urls: [
        {
            text: 'ホーム',
            isUrl: true,
            url: '/home'
        },
        {
            text: ' / 在庫管理',
            isUrl: false,
            url: ''
        },
        {
            text: ' / 入出庫履歴',
            isUrl: false,
            url: ''
        }
    ]
}

// 定义接口
interface Record {
    hid: number
    pid: number
    pname: string
    tname: string
    psname: string
    quantity: number
    aname: string
    preStock: number
    afStock: number
    ename: string
    hdate: string
}

// table 参数
const tableProps: TableProps = reactive({
    data: [],
    headers: [
        {
            name: "履歴ID",
            type: "number"
        },
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
            name: "数量",
            type: "number"
        },
        {
            name: "入出庫区分",
            type: "type"
        },
        {
            name: "入出庫前数量",
            type: "number"
        },
        {
            name: "入出庫後数量",
            type: "number"
        },
        {
            name: "記入者",
            type: "string"
        },
        {
            name: "日時",
            type: "date"
        }
    ],
    actions: []
})

// 调用后端接口 获取表格信息
onBeforeMount(async () => {
    await Get('/api/stock-detail-list').then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            return rsp.data as Record[]
        }
    }).then((data) => {
        tableProps.data.push(...data)
    }).catch((error) => console.log(error))

    emit('loaded')
})

</script>

<template>
    <div class="tableCon">
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <CommonTable v-bind="tableProps"></CommonTable>
    </div>
</template>

<style lang="sass" scoped>
div.tableCon
    max-width: 1400px
</style>