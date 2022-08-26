<script setup>
import { ref, reactive, onBeforeMount } from 'vue'
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
    filters: defaultFilters()
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
                <select>
                    <option value="10">10</option>
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
                    <tr v-for="product in props.data">
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
        <div>
            <span>&lt;&lt; &lt; 1 2 3 4 5 &gt; &gt;&gt;</span>
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

                    
</style>
