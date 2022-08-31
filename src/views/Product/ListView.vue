<script setup>
import { reactive, computed, onBeforeMount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import CommonTable from '@/components/Common/CommonTable.vue';
import CommonModal from '@/components/Common/CommonModal.vue';
import router from '../../../router';
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
    ],
    action: {
        view: "all",
        edit: "all",
        delete: "all"
    }
})

// modal 参数
const modalProps = reactive({
    title: "",
    text: "",
    type: 0
})
// modal 绑定
const modalData = reactive({
    show: false,
    type: '',
    deleteId: 0,
    deleteAuth: false
})

function modalEvent(result) {
    if (modalProps.type == 2) {
        if (result) {
            modalData.show = false
            modalData.deleteAuth = true
            if (modalData.type == 'delete') {
                deleteItem(modalData.deleteId)
            } else if (modalData.type == "deleteAll") {
                deleteAll(modalData.deleteId)
            }

        } else {
            modalData.show = false
        }
    } else {
        modalData.show = false
    }
}

async function deleteItem(id) {
    if (modalData.deleteAuth) {
        modalData.deleteAuth = false
        let response = await fetch('/api/product/' + id, {
            method: 'DELETE'
        })
        if (response.ok) {
            let json = await response.json();
            if (json.success) {
                router.go()
            } else {
                modalProps.title = "エラー"
                modalProps.text = json.message
                modalProps.type = 1
                modalData.show = true
            }
        } else {
            modalProps.title = "エラー"
            modalProps.text = "エラーが発生しました。"
            modalProps.type = 1
            modalData.show = true
        }
    } else {
        modalProps.title = "確認"
        modalProps.text = "該当製品を削除します。<br>よろしいですか？"
        modalProps.type = 2
        modalData.type = 'delete'
        modalData.deleteId = id
        modalData.show = true
    }
}

async function deleteAll(ids) {
    if (modalData.deleteAuth) {
        modalData.deleteAuth = false
        let response = await fetch('/api/product-del', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ids)
        })
        if (response.ok) {
            let json = await response.json();
            if (json.success) {
                router.go()
            } else {
                modalProps.title = "エラー"
                modalProps.text = json.message
                modalProps.type = 1
                modalData.show = true
            }
        } else {
            modalProps.title = "エラー"
            modalProps.text = "エラーが発生しました。"
            modalProps.type = 1
            modalData.show = true
        }
    } else {
        modalProps.title = "確認"
        modalProps.text = ids.length + "件の製品を削除します。<br>よろしいですか？"
        modalProps.type = 2
        modalData.type = 'deleteAll'
        modalData.deleteId = ids
        modalData.show = true
    }
}

function view(id) {
    router.push({ name: 'product-detail', params: { id: id } })
}
</script>
<template>
    <div>
        <CommonModal v-if="modalData.show" v-bind="modalProps" @modalEvent="modalEvent">
        </CommonModal>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <CommonTable @edit="(id) => $router.push({ name: 'product-edit', params: { id: id } })" @view="view"
            @deleteAll="deleteAll" @delete="deleteItem" v-bind="tableProps"></CommonTable>
    </div>
</template>
<style lang="sass" scoped>
</style>