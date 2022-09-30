<script setup lang="ts">
import {computed, onBeforeMount, reactive, watch} from 'vue'
import {Get, Put} from "@/script/api";
import MainViewHeader from '@/components/Common/MainViewHeader.vue'
import {useQuasar} from 'quasar'

const $q = useQuasar()
const emit = defineEmits(['reload', 'loaded'])
// header 参数
const headerProps = {
    title: '権限設定',
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
            text: ' / 権限設定',
            isUrl: false,
            url: ''
        }
    ]
}

// 定义接口
interface Dept {
    label: string
    value: number
}

interface DeptRaw {
    dname: string
    dno: number
}

interface Role {
    label: string
    value: number
    dno: number
}

interface RoleRaw {
    rname: string
    rid: number
    dno: number
}

interface formIn {
    dno: number | null
    rid: number | null
    isLoading: boolean
    isGeting: boolean
}

// 定义权限
interface permission {
    id: number
    name: string
    status: boolean
}

const inPermissionRec: boolean[] = reactive(new Array(24))
const permissionRec: boolean[] = reactive(new Array(24))
const permissionText: string[] = [
    '製品閲覧',
    '製品編集',
    '製品削除',
    '新規製品',
    '生産計画',
    'シリーズ一覧',
    'シリーズ編集',
    'シリーズ削除',
    '新規シリーズ',
    'システム設定',
    '在庫閲覧',
    '入出庫履歴',
    '入出庫操作',
    '顧客閲覧（全部）',
    '顧客閲覧（个人）',
    '顧客編集（全部）',
    '顧客編集（个人）',
    '新規顧客',
    '出庫権限',
    '一次承認',
    '二次承認',
    '見積書閲覧(全部)',
    '注文閲覧（全部）',
    '見積書作成及び修正'
]

const midsData = computed<number[]>(() => {
    return permissionRec.map((b, index) => {
        return {
            id: index + 1,
            b: b
        }
    }).filter(value => value.b).map(value => value.id)
})


// 定义响应式变量
const depts: Dept[] = reactive([])
const roles: Role[] = reactive([])
const rolesOfDept = computed(() => {
    return roles.filter(role => role.dno === form.dno)
})
const form: formIn = reactive({
    dno: null,
    rid: null,
    isLoading: false,
    isGeting: false
})

//是否做了任何修改
const isEdited = computed<boolean>(() => {
    // todo
    return false
})

// 加载页面前 1.获取部门和职位信息 2.初始化权限列表
onBeforeMount(async () => {
    // 获取部门信息
    await Get('/api/dept').then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            return rsp.data as DeptRaw[]
        }
    }).then((data) => {
        data.forEach(e => {
            depts.push({
                label: e.dname,
                value: e.dno
            })
        })
    }).catch((error) => console.log(error))
    // 获取职位信息
    await Get('/api/role').then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            return rsp.data as RoleRaw[]
        }
    }).then((data) => {
        data.forEach(e => {
            roles.push({
                label: e.rname,
                value: e.rid,
                dno: e.dno
            })
        })
    }).catch((error) => console.log(error))

    emit('loaded')
})

// 观察 dno 变化时 重置 rid
watch(() => form.dno,
    (dno, olddno) => {
        if (olddno !== null) {
            form.rid = null
        }
    }
)

// 观察职位id更改 向后端请求权限信息
watch(
    () => form.rid,
    async (rid) => {
        // 如果id修改为null 忽略修改
        if (rid === null) {
            return
        }
        // 设置正在加载状态 重置当前权限列表
        inPermissionRec.fill(false)
        permissionRec.fill(false)
        form.isGeting = true
        // 请求数据
        let result: boolean = await Get('/api/authority/' + rid).then((rsp) => {
            if (rsp instanceof Error) {
                throw rsp
            } else if (!rsp.success) {
                throw new Error(rsp.message)
            } else {
                return rsp.data as number[]
            }
        }).then((data) => {
            data.forEach(mid => {
                inPermissionRec[mid - 1] = true
                permissionRec[mid - 1] = true
            })
            return true
        }).catch((error) => {
            form.isLoading = false
            $q.dialog({
                title: 'エラー',
                message: error.toString(),
                cancel: false,
                persistent: false
            })
            return false
        })
        // 如果失败 还原加载状态 结束处理
        if (!result) {
            form.rid = null
            form.isGeting = false
            return
        }
        form.isGeting = false
    }
)

// 重置数据
function reset() {
    permissionRec.splice(0, permissionRec.length)
    permissionRec.push(...inPermissionRec)
}

// 保存数据
function save() {
    form.isLoading = true
    Put('/api/authority/' + form.rid, midsData.value).then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            emit("reload")
        }
    }).catch((error) => {
        form.isLoading = false
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
    <div>
        <MainViewHeader v-bind="headerProps"></MainViewHeader>
        <div class="formCon">
            <div class="inputCon">
                <q-select class="input" v-model="form.dno" :options="depts"
                          label="部署" outlined emit-value map-options/>
                <q-select class="input" v-model="form.rid"
                          :options="rolesOfDept" label="職位" outlined emit-value map-options/>
            </div>


            <div v-if="!(form.rid === null || form.isGeting === true)">
                <table class="table">
                    <tr>
                        <th>モジュール</th>
                        <th colspan="2">権限項目</th>
                    </tr>
                    <tr>
                        <th rowspan="3">製品</th>
                        <td>製品管理</td>
                        <td>
                            <div class="inputCon">
                                <q-checkbox dense class="checkbox"
                                            v-model="permissionRec[0]"
                                            :label="permissionText[0]"/>
                                <q-checkbox dense class="checkbox"
                                            v-model="permissionRec[1]"
                                            :label="permissionText[1]"/>
                                <q-checkbox dense class="checkbox"
                                            v-model="permissionRec[2]"
                                            :label="permissionText[2]"/>
                                <q-checkbox dense class="checkbox"
                                            v-model="permissionRec[3]"
                                            :label="permissionText[3]"/>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>シリーズ管理</td>
                        <td>
                            <div class="inputCon">
                                <q-checkbox dense class="checkbox" v-model="permissionRec[5]"
                                            :label="permissionText[5]"/>
                                <q-checkbox dense class="checkbox" v-model="permissionRec[6]"
                                            :label="permissionText[6]"/>
                                <q-checkbox dense class="checkbox" v-model="permissionRec[7]"
                                            :label="permissionText[7]"/>
                                <q-checkbox dense class="checkbox" v-model="permissionRec[8]"
                                            :label="permissionText[8]"/>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>生産計画</td>
                        <td>
                            <div class="inputCon">
                                <q-checkbox dense class="checkbox" v-model="permissionRec[4]"
                                            :label="permissionText[4]"/>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>在庫</th>
                        <td>在庫管理</td>
                        <td>
                            <div class="inputCon">
                                <q-checkbox dense v-model="permissionRec[10]" :label="permissionText[10]"/>
                                <q-checkbox dense v-model="permissionRec[11]" :label="permissionText[11]"/>
                                <q-checkbox dense v-model="permissionRec[12]" :label="permissionText[12]"/>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th rowspan="3">顧客</th>
                        <td>顧客閲覧</td>
                        <td>
                            <div class="inputCon">
                                <q-checkbox dense v-model="permissionRec[13]" :label="permissionText[13]"/>
                                <q-checkbox dense v-model="permissionRec[14]" :label="permissionText[14]"/>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>顧客編集</td>
                        <td>
                            <div class="inputCon">
                                <q-checkbox dense v-model="permissionRec[15]" :label="permissionText[15]"/>
                                <q-checkbox dense v-model="permissionRec[16]" :label="permissionText[16]"/>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>新規顧客</td>
                        <td>
                            <div class="inputCon">
                                <q-checkbox dense v-model="permissionRec[17]" :label="permissionText[17]"/>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>システム</th>
                        <td>システム設定</td>
                        <td>
                            <q-checkbox dense v-model="permissionRec[9]" :label="permissionText[9]"/>
                        </td>
                    </tr>
                </table>
                <div class="con">
                    <q-btn class="item" @click="reset" label="リセット" color="secondary"/>
                    <q-btn class="item" @click="save" :loading="form.isLoading"
                           label="保存" color="primary"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.formCon
    margin: 50px auto 0
    padding: 40px 50px
    border-radius: 15px
    box-shadow: rgba(0, 0, 0, 0.16) 0 8px 24px 0
    background-color: #fff

.inputCon
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: start
    gap: 20px 6%
    padding: 0

.input
    flex: 0 1 47%
    padding: 0

.con
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: start
    gap: 20px 20px
    padding: 10px 0

.item
    flex: 0 0 100px

.table
    border-collapse: collapse
    border-radius: 80px 20px
    width: 100%
    padding: 0
    margin: 20px 0

table.table th, table.table td
    border: 1px solid lightgrey
    padding: 1rem
    text-align: left


</style>