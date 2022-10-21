<script setup>
import {computed, reactive, ref, watch} from 'vue'
// prop 定义
const props = defineProps({
    data: {
        type: Array
    },
    headers: {
        type: Array
    },
    actions: {
        type: Array
    }
})

const deleteAction = computed(() => {
    const actions = props.actions.filter(action => action.name === 'delete')
    return {
        all: actions[0].all,
        ids: actions[0].ids
    }
})

const printAction = computed(() => {
    const actions = props.actions.filter(action => action.name === 'print')
    if (actions.length === 0) {
        return {
            all: false,
            ids: []
        }
    }
    return {
        all: actions[0].all,
        ids: actions[0].ids
    }
})

const editAction = computed(() => {
    const actions = props.actions.filter(action => action.name === 'edit')
    return {
        all: actions[0].all,
        ids: actions[0].ids
    }
})

const emailAction = computed(() => {
    const actions = props.actions.filter(action => action.name === 'email')
    if (actions.length === 0) {
        return {
            all: false,
            ids: []
        }
    }
    return {
        all: actions[0].all,
        ids: actions[0].ids
    }
})

const changeStateAction = computed(() => {
    const actions = props.actions.filter(action => action.name === 'changeState')
    if (actions.length === 0) {
        return {
            all: false,
            ids: []
        }
    }
    return {
        all: actions[0].all,
        ids: actions[0].ids
    }
})
// 声明触发的事件
const emit = defineEmits(['delete', 'deleteAll', 'view', 'edit', 'exportExcel', 'reset', 'stockIn', 'stockOut', 'print', 'printAll', 'orderOut', 'orderOutAll', 'pass', 'passAll', 'deny', 'denyAll', 'changeState', 'email'])


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
        if (selectMap.get(id).value === false) {
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
    let result
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
            // 日期过滤
        } else if (filter.type === "date" && filter.date != null && filter.date.length !== 0) {
            result = result.filter(item => {
                let key = Object.keys(item)[index]
                let str = item[key]
                // return str.includes(filter.date)
                return str.substring(0, 10) === filter.date
            })
            // 日期范围过滤
        } else if (filter.type === "dateRange" && filter.dateRange.from != null && filter.dateRange.to != null) {
            result = result.filter(item => {
                let key = Object.keys(item)[index]
                let str = item[key]
                return (str >= filter.dateRange.from && str.substring(0, 10) <= filter.dateRange.to);
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
    if (!props.actions.some(action => action.name === "delete")) {
        return false
    } else if (props.actions.some(action => action.name === "delete" && action.all)) {
        return iSAnySelected.value
    } else {
        if (!iSAnySelected.value) {
            return false
        } else {
            selectMap.forEach((value, key) => {
                if (value.value && !props.actions.some(action => action.name === "delete" && action.ids.includes(key))) {
                    result = false
                }
            })
            return result
        }
    }
})
// 判断是否可打印
const isPrintAble = computed(() => {
    let result = true
    if (!props.actions.some(action => action.name === "print")) {
        return false
    } else if (props.actions.some(action => action.name === "print" && action.all)) {
        return iSAnySelected.value
    } else {
        if (!iSAnySelected.value) {
            return false
        } else {
            selectMap.forEach((value, key) => {
                if (value.value && !props.actions.some(action => action.name === "print" && action.ids.includes(key))) {
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
        } else if (e.type === "date") {
            result[index] = {
                type: "date",
                text: "",
                date: null,
                dateRange: {
                    from: null,
                    to: null
                },
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

// 打印多个
function printAll() {
    let result = new Array()
    selectMap.forEach((value, key) => {
        if (value.value) {
            result.push(key)
        }
    })
    emit("printAll", result)
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

// 批量出库
function orderOut() {
    let result = new Array()
    selectMap.forEach((value, key) => {
        if (value.value) {
            result.push(key)
        }
    })
    emit("orderOutAll", result)
}

// 批量通过
function passAll() {
    let result = new Array()
    selectMap.forEach((value, key) => {
        if (value.value) {
            result.push(key)
        }
    })
    emit("passAll", result)
}

// 批量拒绝
function denyAll() {
    let result = new Array()
    selectMap.forEach((value, key) => {
        if (value.value) {
            result.push(key)
        }
    })
    emit("denyAll", result)
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
    } else if (t === 'date') {
        return [
            {
                label: 'テキスト',
                value: 'string'
            },
            {
                label: '日付',
                value: 'date'
            },
            {
                label: '日付範囲',
                value: 'dateRange'
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

// 是否需要多选
const hasCheckBox = computed(() => {
    return props.actions.some(action => action.name === 'delete' || action.name === 'export' || action.name === 'print' || action.name === 'orderOut' || action.name === 'quoteAudit')
})

// 是否需要操作行
const hasAction = computed(() => {
    return props.actions.some(action => action.name === 'view' || action.name === 'edit' || action.name === 'delete' || action.name === 'reset' || action.name === 'stock' || action.name === 'print' || action.name === 'orderOut' || action.name === 'quoteAudit')
})
</script>

<template>
    <div class="tableCon">
        <div class="operationCon">
            <q-btn color="red" label="削除" v-if="props.actions.some(action => action.name === 'delete')"
                   :disabled="!isDeleteAble"
                   class="del" @click="deleteAll"/>
            <q-btn color="red" label="プリント" v-if="props.actions.some(action => action.name === 'print')"
                   :disabled="!isPrintAble"
                   class="del" @click="printAll"/>
            <q-btn color="primary" v-if="props.actions.some(action => action.name === 'export')" label="エクスポート"
                   :disabled="!iSAnySelected" @click="exportExcel"/>
            <q-btn color="amber" v-if="props.actions.some(action => action.name === 'orderOut')" label="出庫"
                   :disabled="!iSAnySelected" @click="orderOut"/>
            <q-btn color="secondary" v-if="props.actions.some(action => action.name === 'quoteAudit')" label="承認"
                   :disabled="!iSAnySelected" @click="passAll"/>
            <q-btn color="deep-orange" v-if="props.actions.some(action => action.name === 'quoteAudit')" label="却下"
                   :disabled="!iSAnySelected" @click="denyAll"/>
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
                    <td v-if="hasCheckBox"></td>
                    <td v-for="(header, index) in props.headers">
                        <q-select outlined v-model="table.filters[index].type" :options="filterTypes(header.type)"
                                  dense map-options emit-value options-dense/>
                    </td>
                    <td></td>
                </tr>
                <tr class="filterInput">
                    <td v-if="hasCheckBox"></td>
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
                        <q-input dense outlined v-else-if="table.filters[index].type === 'date'"
                                 v-model="table.filters[index].date" mask="date" style="padding: 0">
                            <template v-slot:append>
                                <q-icon name="r_event" class="cursor-pointer">
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                        <q-date today-btn v-model="table.filters[index].date">
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Close" color="primary" flat/>
                                            </div>
                                        </q-date>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>
                        <div v-else-if="table.filters[index].type === 'dateRange'">
                            <q-input dense outlined
                                     v-model="table.filters[index].dateRange.from" mask="date" style="padding: 0">
                                <template v-slot:append>
                                    <q-icon name="r_event" class="cursor-pointer">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                            <q-date range today-btn v-model="table.filters[index].dateRange">
                                                <div class="row items-center justify-end">
                                                    <q-btn v-close-popup label="Close" color="primary" flat/>
                                                </div>
                                            </q-date>
                                        </q-popup-proxy>
                                    </q-icon>
                                </template>
                            </q-input>
                            <br>
                            <q-input dense outlined
                                     v-model="table.filters[index].dateRange.to" mask="date" style="padding: 0">
                                <template v-slot:append>
                                    <q-icon name="r_event" class="cursor-pointer">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                            <q-date range today-btn v-model="table.filters[index].dateRange">
                                                <div class="row items-center justify-end">
                                                    <q-btn v-close-popup label="Close" color="primary" flat/>
                                                </div>
                                            </q-date>
                                        </q-popup-proxy>
                                    </q-icon>
                                </template>
                            </q-input>
                        </div>
                    </td>
                </tr>
                <tr class="tableHeader">
                    <th v-if="hasCheckBox">
                        <q-checkbox :model-value="table.isAllSelected" @click="allSelectClick" dense/>
                    </th>
                    <th class="sortHeader" @click="sortClick(header.name)" v-for="header in props.headers">
                        {{ header.name }}
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
                    <th v-if="hasAction">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="product in tableData" :key="product[Object.keys(product)[0]]">
                    <td v-if="hasCheckBox">
                        <q-checkbox v-model="selectMap.get(product[Object.keys(product)[0]]).value" dense/>
                    </td>
                    <td v-for="(value, key, index) in product">
                        {{ props.headers[index].decimal ? value.toFixed(2) : value }}
                    </td>
                    <td v-if="hasAction">
                        <q-btn v-if="props.actions.some(action => action.name === 'view')"
                               @click="$emit('view', product[Object.keys(product)[0]])" round color="primary"
                               icon="r_visibility" size="10px"/>
                        <q-btn v-if="props.actions.some(action => action.name === 'edit')"
                               :disabled="editAction.all === false && !editAction.ids.includes(product[Object.keys(product)[0]])"
                               @click="$emit('edit', product[Object.keys(product)[0]])" round color="secondary"
                               icon="r_edit" size="10px"/>
                        <q-btn
                            v-if="emailAction.all === true || emailAction.ids.includes(product[Object.keys(product)[0]])"
                            @click="$emit('email', product[Object.keys(product)[0]])" round color="green"
                            icon="r_email" size="10px"/>
                        <q-btn v-if="props.actions.some(action => action.name === 'delete')"
                               :disable="deleteAction.all === false && !deleteAction.ids.includes(product[Object.keys(product)[0]])"
                               @click="$emit('delete', product[Object.keys(product)[0]])" round color="red"
                               icon="r_delete" size="10px"/>
                        <q-btn
                            v-if="printAction.all === true || printAction.ids.includes(product[Object.keys(product)[0]])"
                            @click="$emit('print', product[Object.keys(product)[0]])" round color="grey"
                            icon="r_print" size="10px"/>
                        <q-btn v-if="props.actions.some(action => action.name === 'reset')"
                               @click="$emit('reset', product[Object.keys(product)[0]])" round color="warning"
                               icon="r_replay" size="10px"/>
                        <q-btn v-if="props.actions.some(action => action.name === 'stock')" color="primary"
                               @click="$emit('stockIn', product)" label="入庫" size="13px"
                               style="margin-right: 5px;"/>
                        <q-btn v-if="props.actions.some(action => action.name === 'stock')" color="secondary"
                               @click="$emit('stockOut', product)" label="出庫" size="13px"/>
                        <q-btn v-if="props.actions.some(action => action.name === 'orderOut')" color="amber"
                               @click="$emit('orderOut', product[Object.keys(product)[0]])" label="出庫" size="13px"
                               style="margin-left: 5px;"/>
                        <q-btn v-if="props.actions.some(action => action.name === 'quoteAudit')" color="secondary"
                               @click="$emit('pass', product)" label="承認" size="13px"
                               style="margin-left: 5px;"/>
                        <q-btn v-if="props.actions.some(action => action.name === 'quoteAudit')" color="deep-orange"
                               @click="$emit('deny', product)" label="却下" size="13px"
                               style="margin-left: 5px;"/>
                        <q-btn
                            v-if="changeStateAction.all === true || changeStateAction.ids.includes(product[Object.keys(product)[0]])"
                            color="grey"
                            @click="$emit('changeState', product)" label="状態変更" size="13px"
                            style="margin-left: 5px;"/>
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
    box-shadow: rgba(0, 0, 0, 0.16) 0 8px 24px 0
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
                user-select: none

                &.sortHeader
                    cursor: pointer

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
