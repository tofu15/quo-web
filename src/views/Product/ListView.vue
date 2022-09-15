<script setup>
import {reactive, onBeforeMount} from 'vue'
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import CommonTable from '@/components/Common/CommonTable.vue';
import router from '../../../router';
import {useQuasar} from 'quasar'

const $q = useQuasar()
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
    fetch('/api/product').then((response) => {
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
    ],
    action: {
        view: "all",
        edit: "all",
        delete: "all",
        export: "all"
    }
})

function deleteItem(id) {
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
                router.go()
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

function deleteAll(ids) {
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
                router.go()
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

function view(id) {
    router.push({name: 'product-detail', params: {id: id}})
}

function exportExcel(ids) {
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
    <div>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <CommonTable @exportExcel="exportExcel"
                     @edit="(id) => $router.push({ name: 'product-edit', params: { id: id } })" @view="view"
                     @deleteAll="deleteAll" @delete="deleteItem" v-bind="tableProps"></CommonTable>
    </div>
</template>
<style lang="sass" scoped>
</style>