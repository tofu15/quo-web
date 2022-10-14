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
    title: '見積一覧',
    urls: [
        {
            text: 'ホーム',
            isUrl: true,
            url: '/'
        },
        {
            text: ' / 見積管理',
            isUrl: false,
            url: ''
        },
        {
            text: ' / 見積一覧',
            isUrl: false,
            url: ''
        }
    ]
}
// 调用后端接口 获取表格信息
onBeforeMount(() => {
    Get(Permission.QuoteView ? "/api/quote-all" : "/api/quote-personal").then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            return rsp.data as any[]
        }
    }).then(async (data) => {
        tableProps.data.push(...data)
        // 打印
        const printData = data.filter(value => value.qsname == '送信待ち' || value.qsname == '顧客確認待ち')
        if (printData.length != 0) {
            tableProps.actions.push({
                name: "print",
                all: false,
                ids: printData.map(value => value.qid)
            })
        }
        emit('loaded')

        // 如果没有 个人报价单权限 处理到此结束
        if (!Permission.QuoteSelf) {
            return
        }
        if (Permission.QuoteView) {
            // 获取个人报价单的 id
            await Get("/api/quote-personal").then((rsp) => {
                if (rsp instanceof Error) {
                    throw rsp
                } else if (!rsp.success) {
                    throw new Error(rsp.message)
                } else {
                    return rsp.data as any[]
                }
            }).then((data) => {
                data.map(v => v[Object.keys(v)[0]]).forEach(id => quoteSelfIds.push(id))
            })
        }
        // todo
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
        }
    ]
})

// 个人报价单 id 数组
const quoteSelfIds: number[] = reactive([])

function view(id: number) {
    router.push({name: 'quote-list-detail', params: {id: id}})
}

function exportExcel(ids: number[]) {
    fetch(Permission.QuoteView ? "/api/quote-all-export" : "/api/quote-personal-export", {
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
        fileLink.download = '見積エクスポート.xlsx'
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
    fetch(Permission.QuoteView ? "/api/quote-all-print/" + id : "/api/quote-personal-print/" + id, {
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
        fileLink.download = `見積書${id}.pdf`
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
    fetch(Permission.QuoteView ? "/api/quote-all-print" : "/api/quote-personal-print", {
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
        fileLink.download = '見積書プリント.pdf'
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