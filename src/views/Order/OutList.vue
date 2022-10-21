<script setup lang="ts">
import {inject, onBeforeMount, reactive} from 'vue'
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import CommonTable from '@/components/Common/CommonTable.vue';
import router from '../../router';
import {useQuasar} from 'quasar'
import type {TableProps, UserPermission} from "@/script/interface"
import {DefaultUserPermission} from "@/script/interface"
import {Get, Post} from "@/script/api";

const Permission = inject<UserPermission>('Permission', DefaultUserPermission)
const $q = useQuasar()
const emit = defineEmits(['reload', 'loaded'])
// header 参数
const headerProps = {
    title: '出庫待ち注文',
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
            text: ' / 出庫待ち注文',
            isUrl: false,
            url: ''
        }
    ]
}
// 调用后端接口 获取表格信息
onBeforeMount(() => {
    Get("/api/order-all").then((rsp) => {
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
            name: "orderOut",
            all: true,
            ids: []
        }
    ]
})

function view(id: number) {
    router.push({name: 'order-out-detail', params: {id: id}})
}

function exportExcel(ids: number[]) {
    fetch("/api/quote-stock-export", {
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

function orderOut(id: number) {
    $q.dialog({
        title: '確認',
        message: '当該注文の製品を出庫します。よろしいですか？',
        cancel: true,
        persistent: false
    }).onOk(() => {
        Post('/api/quote-stock-ex/' + id).then((rsp) => {
            if (rsp instanceof Error) {
                throw rsp
            } else if (!rsp.success) {
                throw new Error(rsp.message)
            } else {
                emit('reload')
            }
        }).catch((error) => {
            $q.dialog({
                title: 'エラー',
                message: error.toString(),
                cancel: false,
                persistent: false
            })
        })
    })
}

function orderOutAll(ids: number[]) {
    $q.dialog({
        title: '確認',
        message: ids.length + '件の出庫を行います。よろしいですか？',
        cancel: true,
        persistent: false
    }).onOk(() => {
        Post('/api/quote-stock-ex', ids).then((rsp) => {
            if (rsp instanceof Error) {
                throw rsp
            } else if (!rsp.success) {
                throw new Error(rsp.message)
            } else {
                emit('reload')
            }
        }).catch((error) => {
            $q.dialog({
                title: 'エラー',
                message: error.toString(),
                cancel: false,
                persistent: false
            })
        })
    })
}

</script>
<template>
    <div class="tableCon">
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <CommonTable @exportExcel="exportExcel" @view="view" @orderOutAll="orderOutAll" @orderOut="orderOut"
                     v-bind="tableProps"></CommonTable>
    </div>
</template>
<style lang="sass" scoped>
div.tableCon
    max-width: 1400px
</style>
