<script setup lang="ts">
import {inject, onBeforeMount, reactive} from 'vue'
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import CommonTable from '@/components/Common/CommonTable.vue';
import {Get, Post} from "@/script/api";
import type {TableProps, UserPermission} from "@/script/interface"
import {DefaultUserPermission} from "@/script/interface"
import {useQuasar} from "@modules/quasar";

const $q = useQuasar()
const Permission = inject<UserPermission>('Permission', DefaultUserPermission)
const emit = defineEmits(['reload', 'loaded'])
// header 参数
const headerProps = {
    title: '在庫一覧',
    urls: [
        {
            text: 'ホーム',
            isUrl: true,
            url: '/home'
        },
        {
            text: ' / 在庫管理',
            isUrl: false,
            url: ''
        },
        {
            text: ' / 在庫一覧',
            isUrl: false,
            url: ''
        }
    ]
}

// 定义接口
interface Stock {
    pid: number
    pname: string
    tname: string
    psname: string
    price: number
    stock: number
}

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
            name: "単価（円）",
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
            name: 'export',
            all: true,
            ids: []
        }
    ]
})

// 调用后端接口 获取表格信息
onBeforeMount(async () => {
    await Get('/api/stock-list').then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            return rsp.data as Stock[]
        }
    }).then((data) => {
        tableProps.data.push(...data)
    }).catch((error) => console.log(error))

    if (Permission.StockAction) {
        tableProps.actions.push({
            name: 'stock',
            all: true,
            ids: []
        })
    }

    emit('loaded')
})

function exportExcel(ids: number[]) {
    fetch('/api/stock-export', {
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
        fileLink.download = '在庫エクスポート.xlsx'
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

function stockIn(p: Stock) {
    inputStockNum('入庫').onOk((data: string) => {
        checkStockNum('入庫', p, Number(data)).onOk(() => {
            Post('/api/stock-in/' + p.pid, {quantity: Number(data)}).then((rsp) => {
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
    })
}

function stockOut(p: Stock) {
    inputStockNum('出庫').onOk((data: string) => {
        checkStockNum('出庫', p, Number(data)).onOk(() => {
            Post('/api/stock-out/' + p.pid, {quantity: Number(data)}).then((rsp) => {
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
    })
}

function inputStockNum(str: '入庫' | '出庫') {
    return $q.dialog({
        title: str,
        message: str + 'の数量を入力してください',
        prompt: {
            model: '',
            isValid: val => val.length >= 0 && Number.isInteger(Number(val)) && Number(val) >= 1,
            type: 'number'
        },
        cancel: true,
        persistent: false
    })
}

function checkStockNum(str: '入庫' | '出庫', p: Stock, num: number) {
    const msg: string = `製品番号：${p.pid}<br>製品名：${p.pname}<br>タイプ：${p.tname}<br>シリーズ：${p.psname}<br>数量：${num}<br>`
    return $q.dialog({
        title: str + '情報確認',
        message: msg,
        cancel: true,
        persistent: false,
        html: true
    })
}

</script>

<template>
    <div class="tableCon">
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <CommonTable @exportExcel="exportExcel" @stockIn="stockIn" @stockOut="stockOut"
                     v-bind="tableProps"></CommonTable>
    </div>
</template>

<style lang="sass" scoped>
div.tableCon
    max-width: 1400px
</style>