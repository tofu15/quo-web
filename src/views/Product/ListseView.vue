<script setup lang="ts">
import {computed, inject, onBeforeMount, reactive} from 'vue'
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import CommonTable from '@/components/Common/CommonTable.vue';
import {useQuasar} from 'quasar'
import type {TableAction, TablePropsWithoutAction, UserPermission} from "@/script/interface"
import {DefaultUserPermission} from "@/script/interface"

const Permission = inject<UserPermission>('Permission', DefaultUserPermission)
const $q = useQuasar()
const emit = defineEmits(['reload', 'loaded'])

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

const deleteEnableIds: number[] = []
const actions = computed<TableAction[]>(() => {
    let result: TableAction[] = []
    result.push({
        name: "export",
        all: true,
        ids: []
    })
    if (Permission.ProductEdit) {
        result.push({
            name: "edit",
            all: true,
            ids: []
        })
    }
    if (Permission.ProductDelete) {
        result.push({
            name: "delete",
            all: false,
            ids: deleteEnableIds
        })
    }

    return result
})
// 调用后端接口 获取表格信息
onBeforeMount(async () => {
    // 系列列表
    await fetch('/api/product-series').then((response) => {
        if (!response.ok) {
            throw new Error("HTTP status " + response.status);
        }
        return response.json()
    }).then((json) => {
        if (json.success) {
            tableProps.data.push(...json.data)
        } else {
            throw new Error(json.message);
        }
    }).catch((error) => console.error(error))
    // 是否可删除信息
    await fetch('/api/product-series-del-enable').then((response) => {
        if (!response.ok) {
            throw new Error("HTTP status " + response.status);
        }
        return response.json()
    }).then((json) => {
        if (json.success) {
            json.data.forEach((element: { delEnable: boolean; psid: number; }) => {
                if (element.delEnable) {
                    deleteEnableIds.push(element.psid)
                }
            })
        } else {
            throw new Error(json.message);
        }
    }).catch((error) => console.error(error))


    emit('loaded')
})

// table 参数
const tableProps: TablePropsWithoutAction = reactive({
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

function deleteItem(id: number) {
    $q.dialog({
        title: '確認',
        message: '該当シリーズを削除します。よろしいですか？',
        cancel: true,
        persistent: false
    }).onOk(() => {
        fetch('/api/product-series/' + id, {
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
        message: ids.length + "件のシリーズを削除します。よろしいですか？",
        cancel: true,
        persistent: false
    }).onOk(() => {
        fetch('/api/product-series-del', {
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

function exportExcel(ids: number[]) {
    fetch('/api/productseries-export', {
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
        fileLink.download = 'シリーズエクスポート.xlsx'
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
    <div>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <CommonTable @exportExcel="exportExcel"
                     @edit="(id) => $router.push({ name: 'product-editse', params: { id: id } })"
                     @deleteAll="deleteAll"
                     @delete="deleteItem" v-bind="tableProps" :actions="actions"></CommonTable>
    </div>
</template>
<style lang="sass" scoped>
</style>
