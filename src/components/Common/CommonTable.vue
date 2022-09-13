<script setup>
import {ref, reactive, computed, watch} from 'vue'
// prop 定义
const props = defineProps({
    data: {
        type: Array
    },
    headers: {
        type: Array
    },
    action: {
        type: Object
    }
})
// 声明触发的事件
const emit = defineEmits(['delete', 'deleteAll', 'view', 'edit', 'exportExcel']);


const table = reactive({
    filterOpen: false,
    filters: defaultFilters(),
    everyPage: "20",
    page: 1,
    isAllSelected: false
})
// 声明排序对象
const sort = reactive({
    isSort: false,
    header: '',
    isAscending: true
})

// 排序事件
function sortClick(header) {
    if (!sort.isSort || sort.header !== header) {
        sort.isSort = true
        sort.header = header
        sort.isAscending = true
    } else if (sort.isAscending === true) {
        sort.isAscending = false
    } else {
        sort.isSort = false
        sort.header = ''
        sort.isAscending = true
    }
}


// 选择 Map
const selectMap = reactive(new Map())
// 设置选择 Map
watch(props, () => {
    props.data.forEach((value) => {
        let id = value[Object.keys(value)[0]]
        selectMap.set(id, ref(false))
    })
}, {immediate: true})

// 全选按钮点击
function allSelectClick() {
    let to
    if (table.isAllSelected === true) {
        to = false
    } else {
        to = true
    }
    tableData.value.forEach((item) => {
        let id = item[Object.keys(item)[0]]
        selectMap.get(id).value = to
    })
}

// 判断是否全选
watch(selectMap, (selectMap) => {
    let result = true
    tableData.value.forEach((item) => {
        let id = item[Object.keys(item)[0]]
        if (selectMap.get(id).value == false) {
            result = false
        }
    })
    table.isAllSelected = result
})


const everyPage = computed(() => {
    if (table.everyPage === "999") {
        return 0
    } else {
        return Number(table.everyPage)
    }
})

const numOfPages = computed(() => {
    let result = 1
    if (everyPage.value === 0 || filteredData.value.length === 0) {
        result = 1
    } else {
        let num = filteredData.value.length
        result = Math.ceil(num / everyPage.value)
    }
    return result
})

// 排序后的数据
const sortedData = computed(() => {
    let result = JSON.parse(JSON.stringify(props.data))
    // 进行排序
    if (sort.isSort) {
        let index = 0
        let type = ''
        props.headers.forEach((header, i) => {
            if (header.name === sort.header) {
                index = i
                type = header.type
            }
        })
        if (type === 'number') {
            result.sort((a, b) => {
                const key = Object.keys(a)[index]
                const aNum = a[key]
                const bNum = b[key]
                if (aNum < bNum) {
                    return sort.isAscending ? -1 : 1
                } else if (aNum > bNum) {
                    return sort.isAscending ? 1 : -1
                } else {
                    return 0
                }
            })
        } else {
            result.sort((a, b) => {
                const key = Object.keys(a)[index]
                const aStr = a[key]
                const bStr = b[key]
                if (aStr.localeCompare(bStr, 'ja') < 0) {
                    return sort.isAscending ? -1 : 1
                } else if (aStr.localeCompare(bStr, 'ja') > 0) {
                    return sort.isAscending ? 1 : -1
                } else {
                    return 0
                }
            })
        }
    }
    return result
})

// 过滤后的数据
const filteredData = computed(() => {
    let result = sortedData.value

    // 进行过滤
    table.filters.forEach((filter, index) => {
        // 文本过滤
        if (filter.type === "string" && filter.text.length !== 0) {
            result = result.filter(item => {
                let key = Object.keys(item)[index]
                let str = String(item[key]).toLowerCase()
                return str.includes(filter.text.toLowerCase());
            })
            // 数字过滤
        } else if (filter.type === "number" && filter.num !== "") {
            result = result.filter(item => {
                let key = Object.keys(item)[index]
                let num = item[key]
                return num === filter.num;
            })
            // 数字范围过滤
        } else if (filter.type === "numberRange" && (filter.from !== "" || filter.to !== "")) {
            result = result.filter(item => {
                let key = Object.keys(item)[index]
                let num = item[key]
                if (filter.from !== "" && filter.to !== "" && num >= filter.from && num <= filter.to) {
                    return true
                } else if (filter.from === "" && num <= filter.to) {
                    return true
                } else if (filter.to === "" && num >= filter.from) {
                    return true
                } else {
                    return false
                }
            })
            // 单选过滤
        } else if (filter.type === "select" && filter.select != null) {
            result = result.filter(item => {
                let key = Object.keys(item)[index]
                let str = item[key]
                return str === filter.select;
            })
            // 多选过滤
        } else if (filter.type === "multiSelect" && filter.selects != null && filter.selects.length !== 0) {
            result = result.filter(item => {
                let key = Object.keys(item)[index]
                let str = item[key]
                for (const select of filter.selects) {
                    if (str === select) {
                        return true
                    }
                }
                return false
            })
        }
    })

    // 返回结果
    return result
})

// 显示在表格中的数据
const tableData = computed(() => {
    let result = filteredData.value
    // 分页
    if (everyPage.value === 0) {
        return result
    } else if (table.page === numOfPages.value) {
        return result.slice((table.page - 1) * everyPage.value)
    } else {
        return result.slice((table.page - 1) * everyPage.value, table.page * everyPage.value)
    }
})
// 观察表格中的数据变化 清空选择Map
watch(tableData, () => {
    [...selectMap.keys()].forEach((key) => {
        selectMap.set(key, ref(false))
    })
})
// 判断是否有选中
const iSAnySelected = computed(() => {
    let result = false;
    selectMap.forEach((value, key) => {
        if (value.value) {
            result = true
        }
    })
    return result
})
// 判断是否可选择删除
const isDeleteAble = computed(() => {
    let result = true
    if (!props.action.hasOwnProperty("delete")) {
        return false
    } else if (props.action.delete === "all") {
        return iSAnySelected.value
    } else {
        if (!iSAnySelected.value) {
            return false
        } else {
            selectMap.forEach((value, key) => {
                if (value.value && !props.action.delete.includes(key)) {
                    result = false
                }
            })
            return result
        }
    }
})
// 选择器数据
const tableSelectData = computed(() => {
    let resultSet = []
    let result = []
    props.headers.forEach((value, index) => {
        resultSet[index] = new Set()
        result[index] = new Array()
    })
    props.data.forEach((item, index) => {
        Object.entries(item).forEach(([key, value], i) => {
            resultSet[i].add(value)
        })
    })

    resultSet.forEach((set, index) => {
        set.forEach((value) => {
            result[index].push({
                label: value,
                value: value
            })
        })
    })
    return result
})

// 默认筛选器
function defaultFilters() {
    let result = []
    props.headers.forEach((e, index) => {
        if (e.type === "string") {
            result[index] = {
                type: "string",
                text: "",
                select: null,
                selects: []
            }
        } else if (e.type === "number") {
            result[index] = {
                type: "number",
                text: "",
                num: "",
                from: "",
                to: "",
                select: null,
                selects: []
            }
        } else {
            result[index] = {
                type: "select",
                text: "",
                select: null,
                selects: []
            }
        }
    })
    return result
}

// 删除多个
function deleteAll() {
    let result = new Array()
    selectMap.forEach((value, key) => {
        if (value.value) {
            result.push(key)
        }
    })
    emit("deleteAll", result)
}

// 导出 excel
function exportExcel() {
    let result = new Array()
    selectMap.forEach((value, key) => {
        if (value.value) {
            result.push(key)
        }
    })
    emit("exportExcel", result)
}

// 各个类型的筛选模式
function filterTypes(t) {
    if (t === 'string') {
        return [
            {
                label: 'テキスト',
                value: 'string'
            },
            {
                label: '選択',
                value: 'select'
            },
            {
                label: '複数選択',
                value: 'multiSelect'
            }
        ]
    } else if (t === 'number') {
        return [
            {
                label: 'テキスト',
                value: 'string'
            },
            {
                label: '数字',
                value: 'number'
            },
            {
                label: '数字範囲',
                value: 'numberRange'
            },
            {
                label: '選択',
                value: 'select'
            },
            {
                label: '複数選択',
                value: 'multiSelect'
            }
        ]
    } else {
        return [
            {
                label: 'テキスト',
                value: 'string'
            },
            {
                label: '選択',
                value: 'select'
            },
            {
                label: '複数選択',
                value: 'multiSelect'
            }
        ]
    }
}
</script>

<template>
    <div class="tableCon">
        <div class="operationCon">
            <q-btn color="red" label="削除" v-if="props.action.hasOwnProperty('delete')" :disabled="!isDeleteAble"
                   class="del" @click="deleteAll"/>
            <q-btn color="primary" label="エクスポート" :disabled="!iSAnySelected" @click="exportExcel"/>
        </div>
        <div class="countCon">
            <p>表示件数</p>
            <q-select outlined v-model="table.everyPage"
                      :options="[{ label: '20', value: '20' }, { label: '50', value: '50' }, { label: '100', value: '100' }, { label: 'all', value: '999' }]"
                      @update:model-value="table.page = 1" dense map-options emit-value options-dense/>
            <div class="space"></div>
            <label>
                <q-toggle v-model="table.filterOpen" dense/>
                フィルター設定
            </label>
            <q-btn color="secondary" label="クリア" @click="table.filters = defaultFilters()"/>
        </div>
        <div class="tableWrapper">
            <table>
                <thead>
                <tr v-if="table.filterOpen" class="filterCon">
                    <td></td>
                    <td v-for="(header, index) in props.headers">
                        <q-select outlined v-model="table.filters[index].type" :options="filterTypes(header.type)"
                                  dense map-options emit-value options-dense/>
                    </td>
                    <td></td>
                </tr>
                <tr class="filterInput">
                    <td></td>
                    <td v-for="(header, index) in props.headers">
                        <q-input type="text" outlined v-model="table.filters[index].text" placeholder="テキスト"
                                 v-if="table.filters[index].type === 'string'" dense/>
                        <q-input outlined v-else-if="table.filters[index].type === 'number'"
                                 v-model.number="table.filters[index].num" type="number" placeholder="数字" dense/>
                        <div v-else-if="table.filters[index].type === 'numberRange'">
                            <q-input outlined v-model="table.filters[index].from" type="number" placeholder="From"
                                     dense/>
                            <br>
                            <q-input outlined v-model="table.filters[index].to" type="number" placeholder="To"
                                     dense/>
                        </div>
                        <q-select v-else-if="table.filters[index].type === 'select'" outlined
                                  v-model="table.filters[index].select" :options="tableSelectData[index]" emit-value
                                  clearable dense options-dense/>
                        <q-select multiple v-else-if="table.filters[index].type === 'multiSelect'" outlined
                                  v-model="table.filters[index].selects" :options="tableSelectData[index]" emit-value
                                  clearable dense options-dense use-chips/>
                    </td>
                </tr>
                <tr class="tableHeader">
                    <th>
                        <q-checkbox :model-value="table.isAllSelected" @click="allSelectClick" dense/>
                    </th>
                    <th @click="sortClick(header.name)" v-for="header in props.headers">{{ header.name }}
                        <span v-if="sort.isSort === true && sort.header === header.name && sort.isAscending === true">
                                <q-icon style="rotate: 180deg;" name="r_sort" size="20px"/>
                            </span>
                        <span
                            v-else-if="sort.isSort === true && sort.header === header.name && sort.isAscending === false">
                                <q-icon name="r_sort" size="20px"/>
                            </span>
                        <span v-else>
                                <q-icon name="r_swap_vert" size="20px"/>
                            </span>
                    </th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="product in tableData" :key="product[Object.keys(product)[0]]">
                    <td>
                        <q-checkbox v-model="selectMap.get(product[Object.keys(product)[0]]).value" dense/>
                    </td>
                    <td v-for="(value, key, index) in product">
                        {{ props.headers[index].decimal ? value.toFixed(2) : value }}
                    </td>
                    <td>
                        <q-btn v-if="props.action.hasOwnProperty('view')"
                               :disable="props.action.view !== 'all' && !props.action.view.includes(product[Object.keys(product)[0]])"
                               @click="$emit('view', product[Object.keys(product)[0]])" round color="primary"
                               icon="r_visibility" size="10px"/>
                        <q-btn v-if="props.action.hasOwnProperty('edit')"
                               :disable="props.action.edit !== 'all' && !props.action.edit.includes(product[Object.keys(product)[0]])"
                               @click="$emit('edit', product[Object.keys(product)[0]])" round color="secondary"
                               icon="r_edit" size="10px"/>
                        <q-btn v-if="props.action.hasOwnProperty('delete')"
                               :disabled="props.action.delete !== 'all' && !props.action.delete.includes(product[Object.keys(product)[0]])"
                               @click="$emit('delete', product[Object.keys(product)[0]])" round color="red"
                               icon="r_delete" size="10px"/>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="q-pa-lg flex justify-end">
            <q-pagination
                v-model="table.page"
                :max="numOfPages"
                :max-pages="5"
                direction-links
                boundary-links
                icon-first="r_skip_previous"
                icon-last="r_skip_next"
                icon-prev="r_fast_rewind"
                icon-next="r_fast_forward"
            />
        </div>
    </div>
</template>

<style lang="sass" scoped>
div.tableCon
    box-shadow: rgba(0, 0, 0, 0.16) 0px 8px 24px 0px
    border-radius: 15px
    background-color: #ffffff
    padding: 28px
    // button, select, label
        // line-height: 1
        // width: auto
        // display: inline-block

    > div.operationCon
        margin-bottom: 16px
        text-align: end

        > *:not(:last-child)
            margin-right: 10px

    > div.countCon
        *
            margin: 0

        > div.space
            flex: 1
        display: flex
        align-items: center
        margin-bottom: 16px

        > button
            margin-left: 20px

        > p
            margin-right: 10px
    // &, button, label
    //     font-weight: 500

    div.tableWrapper
        white-space: nowrap
        overflow-x: auto

        table
            border-collapse: collapse

        th, td
            text-align: start
            padding: 10px

        tr.filterInput
            td
                width: auto
                padding-right: 15px
                padding-bottom: 15px

                > *
                    width: 100%

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
