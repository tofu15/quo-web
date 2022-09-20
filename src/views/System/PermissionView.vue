<script setup lang="ts">
import {reactive, computed, onBeforeMount, watch} from 'vue'
import {Get, Put} from "@/script/api";
import MainViewHeader from '@/components/Common/MainViewHeader.vue'
import {useQuasar} from 'quasar'
import router from "../../../router";

const $q = useQuasar()

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
}

const permissionList: permission[] = [
    {
        id: 1,
        name: '製品閲覧'
    },
    {
        id: 2,
        name: '製品編集'
    },
    {
        id: 3,
        name: '製品削除'
    },
    {
        id: 4,
        name: '新規製品'
    },
    {
        id: 5,
        name: '生産計画'
    },
    {
        id: 6,
        name: 'シリーズ一覧'
    },
    {
        id: 7,
        name: 'シリーズ編集'
    },
    {
        id: 8,
        name: 'シリーズ削除'
    },
    {
        id: 9,
        name: '新規シリーズ'
    },
    {
        id: 10,
        name: 'システム設定'
    }
]

// 定义响应式变量
const depts: Dept[] = reactive([])
const roles: Role[] = reactive([])
const rolesOfDept = computed(() => {
    return roles.filter(role => role.dno === form.dno)
})
const permissionOfRole: Array<boolean> = reactive([])
const inPermissionOfRole: Array<boolean> = reactive([])
const form: formIn = reactive({
    dno: null,
    rid: null,
    isLoading: false,
    isGeting: false
})

//是否做了任何修改
const isEdited = computed<boolean>(() => {
    for (const [i, b] of permissionOfRole.entries()) {
        if (inPermissionOfRole[i] !== b) {
            return true
        }
    }
    return false
})

// 加载页面前 1.获取部门和职位信息 2.初始化权限列表
onBeforeMount(() => {
    // 获取部门信息
    Get('/api/dept').then((rsp) => {
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
    Get('/api/role').then((rsp) => {
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

    // 初始化权限列表
    permissionList.forEach(() => {
        permissionOfRole.push(false)
        inPermissionOfRole.push(false)
    })
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
        permissionOfRole.fill(false)
        inPermissionOfRole.fill(false)
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
            for (const n of data) {
                permissionOfRole[n - 1] = true
                inPermissionOfRole[n - 1] = true
            }
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
    inPermissionOfRole.forEach((value, index) => {
        permissionOfRole[index] = value
    })
}

// 保存数据
function save() {
    const data: Array<number> = []
    permissionOfRole.forEach((value, index) => {
        if (value) {
            data.push(index + 1)
        }
    })
    form.isLoading = true
    Put('/api/authority/' + form.rid, data).then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            router.go(0)
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
        <QSelect v-model="form.dno" :options="depts"
                  label="部署" outlined emit-value map-options/>
        <QSelect v-model="form.rid"
                  :options="rolesOfDept" label="職位" outlined emit-value map-options/>
        <div v-if="!(form.rid === null || form.isGeting === true)">
            <q-checkbox v-model="permissionOfRole[0]" :label="permissionList[0].name"/>
            <q-checkbox v-model="permissionOfRole[1]" :label="permissionList[1].name"/>
            <q-checkbox v-model="permissionOfRole[2]" :label="permissionList[2].name"/>
            <q-checkbox v-model="permissionOfRole[3]" :label="permissionList[3].name"/>
            <q-checkbox v-model="permissionOfRole[4]" :label="permissionList[4].name"/>
            <q-checkbox v-model="permissionOfRole[5]" :label="permissionList[5].name"/>
            <q-checkbox v-model="permissionOfRole[6]" :label="permissionList[6].name"/>
            <q-checkbox v-model="permissionOfRole[7]" :label="permissionList[7].name"/>
            <q-checkbox v-model="permissionOfRole[8]" :label="permissionList[8].name"/>
            <q-checkbox v-model="permissionOfRole[9]" :label="permissionList[9].name"/>
            <q-btn @click="reset" label="リセット" color="secondary"/>
            <q-btn @click="save" :loading="form.isLoading" :disable="!isEdited"
                   label="保存" color="primary"/>
        </div>
    </div>
</template>

<style scoped>

</style>