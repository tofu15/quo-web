<script setup lang="ts">
import {inject, onBeforeMount, reactive} from 'vue'
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import CommonTable from '@/components/Common/CommonTable.vue';
import {Delete, Get, Post, Put} from "@/script/api";
import {useQuasar} from 'quasar'
import type {TableProps, UserPermission} from "@/script/interface"
import {DefaultUserPermission} from "@/script/interface"

const Permission = inject<UserPermission>('Permission', DefaultUserPermission)
const $q = useQuasar()
const emit = defineEmits(['reload', 'loaded'])
// header 参数
const headerProps = {
    title: 'ユーザー管理',
    urls: [
        {
            text: 'ホーム',
            isUrl: true,
            url: '/'
        },
        {
            text: ' / システム設定',
            isUrl: false,
            url: ''
        },
        {
            text: ' / ユーザー管理',
            isUrl: false,
            url: ''
        }
    ]
}

// 定义 User 接口
interface User {
    eno: number
    ename: string
    dname: string
    rname: string
    tel: string
    email: string
}

// table 参数
const tableProps: TableProps = reactive({
    data: [],
    headers: [
        {
            name: "従業員番号",
            type: "number"
        },
        {
            name: "氏名",
            type: "string"
        },
        {
            name: "部署",
            type: "type"
        },
        {
            name: "職位",
            type: "type"
        },
        {
            name: "電話番号",
            type: "string"
        },
        {
            name: "email",
            type: "string"
        }
    ],
    actions: [
        {
            name: "edit",
            all: true,
            ids: []
        },
        {
            name: "delete",
            all: true,
            ids: []
        },
        {
            name: "reset",
            all: true,
            ids: []
        }
    ]
})

// 调用后端接口 获取表格信息
onBeforeMount(async () => {
    await Get('/api/users').then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            return rsp.data as User[]
        }
    }).then((data) => {
        tableProps.data.push(...data)
    }).catch((error) => console.log(error))

    emit('loaded')
})

// 删除单个用户
function deleteItem(id: number) {
    $q.dialog({
        title: '確認',
        message: '該当ユーザーを削除します。よろしいですか？',
        cancel: true,
        persistent: false
    }).onOk(() => {
        Delete('/api/user/' + id).then((rsp) => {
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

// 删除多个用户
function deleteAll(ids: number[]) {
    $q.dialog({
        title: '確認',
        message: ids.length + '人のユーザーを削除します。よろしいですか？',
        cancel: true,
        persistent: false
    }).onOk(() => {
        Post('/api/users-del', ids).then((rsp) => {
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

// 重置用户
function reset(id: number) {
    $q.dialog({
        title: '確認',
        message: '該当ユーザーをリセットします。よろしいですか？',
        cancel: true,
        persistent: false
    }).onOk(() => {
        Put('/api/user-reset/' + id).then((rsp) => {
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
        <CommonTable
            @edit="(id) => $router.push({ name: 'system-user-edit', params: { id: id } })"
            @deleteAll="deleteAll" @delete="deleteItem" @reset="reset" v-bind="tableProps"></CommonTable>
    </div>
</template>

<style lang="sass" scoped>
div.tableCon
    max-width: 1200px
</style>