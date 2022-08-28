<script setup>
import { ref, reactive, onBeforeMount, computed } from 'vue'
import { RouterLink } from 'vue-router'
// prop 定义
const props = defineProps({
    data: {
        type: Array
    },
    headers: {
        type: Array
    }
})

const table = reactive({
    filterOpen: false,
    filters: defaultFilters(),
    everyPage: "20",
    page: 1
})

const everyPage = computed(() => {
    if (table.everyPage == "999") {
        return 0
    } else {
        return Number(table.everyPage)
    }
})

const numOfPages = computed(() => {
    if (everyPage.value == 0) {
        return 1
    } else {
        let num = props.data.length
        return Math.ceil(num / everyPage.value)
    }
})
// 页码
const paginator = computed(() => {
    let result = []
    let start = 0
    let end = 0
    // 添加当前页之前的页码
    if (table.page - 2 >= 1) {
        start = table.page - 2
    } else if (table.page == 2) {
        start = 2
    } else {
        start = 1
    }
    // 添加当前页之后的页码
    if (numOfPages.value - table.page > 1) {
        result.push(table.page + 1, table.page + 2)
    } else if (table.page == numOfPages.value - 1) {
        result.push(table.page + 1)
    }
    return result
})

const tableData = computed(() => {
    let amount = props.data.length
    if (everyPage.value == 0) {
        return props.data
    } else if (table.page == numOfPages.value) {
        return props.data.slice((table.page - 1) * everyPage.value)
    } else {
        return props.data.slice((table.page - 1) * everyPage.value, table.page * everyPage.value)
    }
})

function defaultFilters() {
    let result = []
    props.headers.forEach((e, index) => {
        if (e.type == "string") {
            result[index] = {
                type: "string",
                text: "",
                select: "",
                selects: []
            }
        } else if (e.type == "number") {
            result[index] = {
                type: "number",
                num: "",
                from: "",
                to: "",
                select: "",
                selects: []
            }
        } else {
            result[index] = {
                type: "select",
                select: "",
                selects: []
            }
        }
    })
    return result
}
</script>

<template>
    <div class="tableCon">
        <div class="operationCon">
            <button class="del">削除</button>
            <button class="expBtn">エクスポート</button>
        </div>
        <div class="countCon">
            <div>
                <span>表示件数</span>
                <select v-model="table.everyPage">
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="999">all</option>
                </select>
            </div>
            <div class="space"></div>
            <label for="switch-1">
                <input v-model="table.filterOpen" type="checkbox" role="switch">
                フィルター設定
            </label>
            <button class="secondary">クリア</button>
        </div>
        <div class="tableWrapper">
            <table>
                <thead>
                    <tr v-if="table.filterOpen" class="filterCon">
                        <td></td>
                        <td v-for="(header, index) in props.headers"><select v-model="table.filters[index].type">
                                <option v-if="header.type == 'string'" value="string">テキスト</option>
                                <option v-if="header.type == 'number'" value="number">数字</option>
                                <option v-if="header.type == 'number'" value="numberRange">数字範囲</option>
                                <option value="select">選択</option>
                                <option value="multiSelect">複数選択</option>
                            </select></td>
                        <td></td>
                    </tr>
                    <tr class="filterInput">
                        <td></td>
                        <td v-for="(header, index) in props.headers">
                            <input v-if="table.filters[index].type == 'string'" v-model="table.filters[index].text"
                                type="text" placeholder="テキスト">
                            <input v-if="table.filters[index].type == 'number'" v-model="table.filters[index].num"
                                type="number" placeholder="数字">
                            <div v-if="table.filters[index].type == 'numberRange'">
                                <input v-model="table.filters[index].from" type="number" placeholder="From">
                                <br>
                                <input v-model="table.filters[index].to" type="number" placeholder="To">
                            </div>
                        </td>
                    </tr>
                    <tr class="tableHeader">
                        <th><input type="checkbox"></th>
                        <th v-for="header in props.headers">{{ header.name }}<span><svg
                                    xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrows-sort"
                                    width="18" height="18" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                                    fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M3 9l4 -4l4 4m-4 -4v14"></path>
                                    <path d="M21 15l-4 4l-4 -4m4 4v-14"></path>
                                </svg></span></th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in tableData">
                        <td><input type="checkbox"></td>
                        <td v-for="(value, key, index) in product">{{ props.headers[index].decimal ? value.toFixed(2) :
                                value
                        }}</td>
                        <td>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
                                <path d="M0 0h24v24H0V0z" fill="none" />
                                <path
                                    d="M12 4C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
                                <path d="M0 0h24v24H0V0z" fill="none" />
                                <path
                                    d="M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                            </svg><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24"
                                width="24px">
                                <path d="M0 0h24v24H0V0z" fill="none" />
                                <path
                                    d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z" />
                            </svg>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="paginatorCon">
            <svg :disabled="table.page == 1" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24"
                height="24px" viewBox="0 0 24 24" width="24px">
                <g>
                    <rect fill="none" height="24" width="24" />
                    <rect fill="none" height="24" width="24" />
                </g>
                <g>
                    <g>
                        <path
                            d="M18.29,17.29L18.29,17.29c0.39-0.39,0.39-1.02,0-1.41L14.42,12l3.88-3.88c0.39-0.39,0.39-1.02,0-1.41l0,0 c-0.39-0.39-1.02-0.39-1.41,0l-4.59,4.59c-0.39,0.39-0.39,1.02,0,1.41l4.59,4.59C17.27,17.68,17.9,17.68,18.29,17.29z" />
                        <path
                            d="M11.7,17.29L11.7,17.29c0.39-0.39,0.39-1.02,0-1.41L7.83,12l3.88-3.88c0.39-0.39,0.39-1.02,0-1.41l0,0 c-0.39-0.39-1.02-0.39-1.41,0l-4.59,4.59c-0.39,0.39-0.39,1.02,0,1.41l4.59,4.59C10.68,17.68,11.31,17.68,11.7,17.29z" />
                    </g>
                </g>
            </svg>
            <svg :disabled="table.page == 1" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24"
                width="24px">
                <path
                    d="M14.71 15.88L10.83 12l3.88-3.88c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L8.71 11.3c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .38-.39.39-1.03 0-1.42z" />
            </svg>
            <span v-for="p in paginator">{{ p }}</span>
            <svg :disabled="table.page == numOfPages" xmlns="http://www.w3.org/2000/svg" height="24px"
                viewBox="0 0 24 24" width="24px">
                <path
                    d="M9.29 15.88L13.17 12 9.29 8.12c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l4.59 4.59c.39.39.39 1.02 0 1.41L10.7 17.3c-.39.39-1.02.39-1.41 0-.38-.39-.39-1.03 0-1.42z" />
            </svg>
            <svg :disabled="table.page == numOfPages" xmlns="http://www.w3.org/2000/svg"
                enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px">
                <g>
                    <rect fill="none" height="24" width="24" />
                    <rect fill="none" height="24" width="24" />
                </g>
                <g>
                    <g>
                        <path
                            d="M5.7,6.71L5.7,6.71c-0.39,0.39-0.39,1.02,0,1.41L9.58,12L5.7,15.88c-0.39,0.39-0.39,1.02,0,1.41l0,0 c0.39,0.39,1.02,0.39,1.41,0l4.59-4.59c0.39-0.39,0.39-1.02,0-1.41L7.12,6.71C6.73,6.32,6.09,6.32,5.7,6.71z" />
                        <path
                            d="M12.29,6.71L12.29,6.71c-0.39,0.39-0.39,1.02,0,1.41L16.17,12l-3.88,3.88c-0.39,0.39-0.39,1.02,0,1.41l0,0 c0.39,0.39,1.02,0.39,1.41,0l4.59-4.59c0.39-0.39,0.39-1.02,0-1.41l-4.59-4.59C13.32,6.32,12.68,6.32,12.29,6.71z" />
                    </g>
                </g>
            </svg>
        </div>
    </div>
</template>

<style lang="sass" scoped>
div.tableCon
    box-shadow: rgba(0, 0, 0, 0.16) 0px 8px 24px 0px
    border-radius: 15px
    background-color: #ffffff
    padding: 28px
    button, select, label
        line-height: 1
        width: auto
        display: inline-block

    >div.operationCon
        text-align: end
        >button:not(:last-child)
            margin-right: 10px
        >button
            font-weight: 500

    >div.countCon
        *
            margin: 0
        >div.space
            flex: 1
        display: flex
        align-items: center
        margin-bottom: 16px
        >button
            margin-left: 20px
        select
            margin-left: 10px
        &, button, label
            font-weight: 500

    div.tableWrapper
        white-space: nowrap
        overflow-x: auto
        table
            border-collapse: collapse
        select
            width: 100%
        th, td
            text-align: start
            padding: 10px
        tr.filterCon
            select
                padding: 6px 20px 6px 5px
                background-position: center right 5px
        tr.filterInput
            td
                padding-right: 15px
                padding-bottom: 15px
            input
                margin-bottom: 10px
                padding: 0
                height: 35px
                box-shadow: none
                border-radius: 0
                border-width: 0
                border-bottom-width: 2px
        tr.tableHeader
            th
                padding-right: 40px
                position: relative
                border-width: 1px 0 1px 0
                border-style: solid
                border-color: rgb(228, 228, 228)
                &:not(:first-child)
                    cursor: pointer
                    user-select: none
                    &:hover
                        background: rgba(0, 0, 0, 0.04)
                        color: rgba(0, 0, 0, 0.87)
                span
                    position: absolute
                    right: 15px
                    top: 7px
        
        tbody
            tr:hover
                background: rgba(0, 0, 0, 0.04)
                color: rgba(0, 0, 0, 0.87)
            td
                border-width: 0 0 1px 0
                border-style: solid
                border-color: rgb(228, 228, 228)
            svg
                cursor: pointer

div.paginatorCon
    display: flex
    justify-content: flex-end
    align-items: center
    >*
        user-select: none
        display: block
        border-radius: 50%
        &[active]
            background: #EFF6FF
            color: #1D4ED8
        &[disabled="true"]
            color: hsl(0deg 0% 71%)
        &:not([disabled="true"]):not([active])
            cursor: pointer
            &:hover
                background: #e9ecef
            
    span
        line-height: 38px
        height: 40px
        width: 40px
        text-align: center
    svg
        height: 40px
        width: 40px
        padding: 8px

                    
</style>
