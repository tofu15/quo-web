<script setup>
import {reactive, onBeforeMount} from 'vue'
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import CommonTable from '@/components/Common/CommonTable.vue';
import router from '../../../router';
import {useQuasar} from 'quasar'

const $q = useQuasar()

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
onBeforeMount(() => {
    // 系列列表
    fetch('/api/product-series').then((response) => {
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
    fetch('/api/product-series-del-enable').then((response) => {
        if (!response.ok) {
            throw new Error("HTTP status " + response.status);
        }
        return response.json()
    }).then((json) => {
        if (json.success) {
            json.data.forEach(element => {
                if (element.delEnable) {
                    tableProps.action.delete.push(element.psid)
                }
            })
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
    ],
    action: {
        edit: "all",
        delete: []
    }
})

function deleteItem(id) {
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
</script>
<template>
    <div>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <CommonTable @edit="(id) => $router.push({ name: 'product-editse', params: { id: id } })"
                     @deleteAll="deleteAll"
                     @delete="deleteItem" v-bind="tableProps"></CommonTable>
    </div>
</template>
<style lang="sass" scoped>
</style>
