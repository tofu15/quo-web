<script setup>
import { reactive, computed, onBeforeMount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import CommonTable from '@/components/Common/CommonTable.vue';
import CommonModal from '@/components/Common/CommonModal.vue';
import router from '/router';
import { id } from 'date-fns/locale';
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
onBeforeMount(async () => {
    let productseJson = await (await fetch('/api/product-series')).json()
    productseJson.data.forEach(element => {
        tableProps.data.push(element)
    })

    let deleteJson = await (await fetch('/api/product-series-del-enable')).json()
    deleteJson.data.forEach(element => {
        if (element.delEnable) {
            tableProps.action.delete.push(element.psid)
        }
    })
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
        view: "all",
        edit: "all",
        delete: new Array()
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
    deleteId: 0,
    deleteAuth: false
})

function modalEvent(result) {
    if (modalProps.type == 2) {
        if (result) {
            modalData.show = false
            modalData.deleteAuth = true
            deleteItem(modalData.deleteId)
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
        let response = await fetch('/api/product-series/' + id, {
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
        modalProps.text = "該当シリーズを削除します。<br>よろしいですか？"
        modalProps.type = 2
        modalData.deleteId = id
        modalData.show = true
    }
}
</script>
<template>
    <div>
        <CommonModal v-if="modalData.show" v-bind="modalProps" @modalEvent="modalEvent">
        </CommonModal>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <CommonTable @delete="deleteItem" v-bind="tableProps"></CommonTable>
    </div>
</template>
<style lang="sass" scoped>
</style>