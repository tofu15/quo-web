<script setup lang="ts">
import {inject, onBeforeMount, reactive} from 'vue'
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import CommonTable from '@/components/Common/CommonTable.vue';
import router from '../../router';
import {useQuasar} from 'quasar'
import type {TableProps, UserPermission} from "@/script/interface"
import {DefaultUserPermission} from "@/script/interface"
import {Get} from "@/script/api";

const Permission = inject<UserPermission>('Permission', DefaultUserPermission)
const $q = useQuasar()
const emit = defineEmits(['reload', 'loaded'])
// header 参数
const headerProps = {
    title: '注文一覧',
    urls: [
        {
            text: 'ホーム',
            isUrl: true,
            url: '/'
        },
        {
            text: ' / 注文管理',
            isUrl: false,
            url: ''
        },
        {
            text: ' / 注文一覧',
            isUrl: false,
            url: ''
        }
    ]
}
// 调用后端接口 获取表格信息
onBeforeMount(() => {
    Get(Permission.OrderView ? "/api/order-all" : "/api/order-personal").then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            return rsp.data as any[]
        }
    }).then((data) => {
        tableProps.data.push(...data)
        emit('loaded')
    }).catch((error) => console.error(error))
})
// table 参数
const tableProps: TableProps = reactive({
    data: [],
    headers: [
        {
            name: "ID",
            type: "number"
        },
        {
            name: "件名",
            type: "string"
        },
        {
            name: "作成日",
            type: "date"
        },
        {
            name: "合計金額（税込み）",
            type: "number",
            decimal: true
        },
        {
            name: "顧客名称",
            type: "string"
        },
        {
            name: "状態",
            type: "type"
        },
        {
            name: "作成者",
            type: "string"
        }
    ],
    actions: [
        {
            name: "export",
            all: true,
            ids: []
        },
        {
            name: "view",
            all: true,
            ids: []
        },
        {
            name: "print",
            all: true,
            ids: []
        }
    ]
})

function view(id: number) {
    router.push({name: 'order-list-detail', params: {id: id}})
}

function exportExcel(ids: number[]) {
    fetch(Permission.OrderView ? "/api/order-all-export" : "/api/order-personal-export", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ids)
    }).then((response) => {
        if (!response.ok) {
            throw new Error("HTTP status " + response.status)
        }
        return response.blob()
    }).then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const fileLink = document.createElement('a');
        fileLink.href = url;
        fileLink.download = '注文エクスポート.xlsx'
        document.body.appendChild(fileLink)
        fileLink.click()
        fileLink.remove()
    }).catch((error) => {
        $q.dialog({
            title: 'エラー',
            message: error.toString(),
            cancel: false,
            persistent: false
        })
    })
}

function print(id: number) {
    fetch(Permission.OrderView ? "/api/order-all-print/" + id : "/api/order-personal-print/" + id, {
        method: 'GET'
    }).then((response) => {
        if (!response.ok) {
            throw new Error("HTTP status " + response.status)
        }
        return response.blob()
    }).then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const fileLink = document.createElement('a');
        fileLink.href = url;
        fileLink.download = `注文書${id}.pdf`
        document.body.appendChild(fileLink)
        fileLink.click()
        fileLink.remove()
    }).catch((error) => {
        $q.dialog({
            title: 'エラー',
            message: error.toString(),
            cancel: false,
            persistent: false
        })
    })
}

function printAll(ids: number[]) {
    fetch(Permission.OrderView ? "/api/order-all-print" : "/api/order-personal-print", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ids)
    }).then((response) => {
        if (!response.ok) {
            throw new Error("HTTP status " + response.status)
        }
        return response.blob()
    }).then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const fileLink = document.createElement('a');
        fileLink.href = url;
        fileLink.download = '注文書プリント.pdf'
        document.body.appendChild(fileLink)
        fileLink.click()
        fileLink.remove()
    }).catch((error) => {
        $q.dialog({
            title: 'エラー',
            message: error.toString(),
            cancel: false,
            persistent: false
        })
    })
}
</script>
<template>
    <div class="tableCon">
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <CommonTable @exportExcel="exportExcel" @view="view" @print="print" @printAll="printAll"
                     v-bind="tableProps"></CommonTable>
    </div>
</template>
<style lang="sass" scoped>
div.tableCon
    max-width: 1400px
</style>