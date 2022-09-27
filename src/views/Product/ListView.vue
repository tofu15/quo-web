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
onBeforeMount(() => {
    if (Permission.ProductEdit) {
        tableProps.actions.push({
            name: "edit",
            all: true,
            ids: []
        })
    }
    if (Permission.ProductDelete) {
        tableProps.actions.push({
            name: "delete",
            all: true,
            ids: []
        })
    }
    Get('/api/product').then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            return rsp.data as any
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
        }
    ]
})

function deleteItem(id: number) {
    $q.dialog({
        title: '確認',
        message: '該当製品を削除します。よろしいですか？',
        cancel: true,
        persistent: false
    }).onOk(() => {
        fetch('/api/product/' + id, {
            method: 'DELETE'
        }).then((response) => {
            if (!response.ok) {
                throw new Error("HTTP status " + response.status)
            }
            return response.json()
        }).then((json) => {
            if (json.success) {
                emit('reload')
            } else {
                throw new Error(json.message)
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

function deleteAll(ids: number[]) {
    $q.dialog({
        title: '確認',
        message: ids.length + "件の製品を削除します。よろしいですか？",
        cancel: true,
        persistent: false
    }).onOk(() => {
        fetch('/api/product-del', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ids)
        }).then((response) => {
            if (!response.ok) {
                throw new Error("HTTP status " + response.status)
            }
            return response.json()
        }).then((json) => {
            if (json.success) {
                emit('reload')
            } else {
                throw new Error(json.message)
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

function view(id: number) {
    router.push({name: 'product-detail', params: {id: id}})
}

function exportExcel(ids: number[]) {
    fetch('/api/product-export', {
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
        fileLink.download = '製品エクスポート.xlsx'
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
        <CommonTable @exportExcel="exportExcel"
                     @edit="(id) => $router.push({ name: 'product-edit', params: { id: id } })" @view="view"
                     @deleteAll="deleteAll" @delete="deleteItem" v-bind="tableProps"></CommonTable>
    </div>
</template>
<style lang="sass" scoped>
div.tableCon
    max-width: 1400px
</style>