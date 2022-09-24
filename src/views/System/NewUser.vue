<script setup lang="ts">
import {computed, onBeforeMount, reactive, watch} from 'vue'
import {onBeforeRouteLeave} from 'vue-router'
import MainViewHeader from '@/components/Common/MainViewHeader.vue';
import router from '@/router';
import {useQuasar} from 'quasar'
import {Get, Post} from "@/script/api";

const $q = useQuasar()

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

interface FormIn {
    name: string
    dno: null | number
    rid: null | number
    email: string
    tel: string
    isLoading: boolean
}

// 获取部门和职位信息
const depts: Dept[] = reactive([])
const roles: Role[] = reactive([])
const rolesOfDept = computed(() => {
    return roles.filter(role => role.dno === form.dno)
})

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
})

// header 参数
const headerProps = {
    title: '新規ユーザー',
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
            text: ' / 新規ユーザー',
            isUrl: false,
            url: ''
        }
    ]
}

// modal 绑定
const modalData = reactive({
    url: '',
    auth: false
})

const isAnyEdit = computed(() => {
    if (form.name.length === 0 && form.dno === null && form.rid === null && form.email.length === 0 && form.tel.length === 0) {
        return false
    } else {
        return true
    }
})

onBeforeRouteLeave((to) => {
    if (!isAnyEdit.value || modalData.auth) {
        return true
    } else {
        modalData.url = to.path
        $q.dialog({
            title: '確認',
            message: 'この画面から離れます。入力中のデータは保存されません。よろしいですか？',
            cancel: true,
            persistent: false
        }).onOk(() => {
            modalData.auth = true
            router.push(modalData.url)
        })
        return false
    }
})

// 表单动态绑定
const form: FormIn = reactive({
    name: '',
    dno: null,
    rid: null,
    email: '',
    tel: '',
    isLoading: false
})
// 初始表单
const initialForm = reactive({
    name: '',
    dno: null,
    rid: null,
    email: '',
    tel: '',
    isLoading: false
})

// 观察 dno 变化时 重置 rid
watch(() => form.dno, (dno, olddno) => {
    if (olddno !== null) {
        form.rid = null
    }
})

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const telRegex = /^0[5789]0-[0-9]{4}-[0-9]{4}$/


// post 上传数据
function postData() {
    form.isLoading = true
    const data = {
        ename: form.name,
        dno: form.dno,
        rid: form.rid,
        tel: form.tel,
        email: form.email
    }
    Post('/api/user', data).then((rsp) => {
        if (rsp instanceof Error) {
            throw rsp
        } else if (!rsp.success) {
            throw new Error(rsp.message)
        } else {
            form.isLoading = false
            modalData.auth = true
            router.push('/system/user')
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
            <q-form greedy @reset="Object.assign(form, initialForm)" @submit="postData">
                <div class="inputCon">
                    <q-input class="input"
                             :rules="[val => !!val || '入力必須です。', val => val.length <= 12 || '12文字まで。']"
                             v-model.trim="form.name" label="氏名" outlined/>
                    <q-select class="input" :rules="[val => !!val || '入力必須です。']" v-model="form.dno" :options="depts"
                              label="部署" outlined emit-value map-options/>
                    <q-select class="input" :rules="[val => !!val || '入力必須です。']" v-model="form.rid"
                              :options="rolesOfDept" label="職位" outlined emit-value map-options/>
                    <q-input class="input" :rules="[val => !val || emailRegex.test(val) || '有効なメールアドレスではありません。']"
                             v-model.trim="form.email" label="email" outlined/>
                    <q-input class="input" :rules="[val => !val || telRegex.test(val) || '有効な携帯番号ではありません。']"
                             v-model.trim="form.tel" label="携帯電話" outlined/>
                </div>
                <div class="con">
                    <q-btn class="item" label="リセット" type="reset" color="secondary"/>
                    <q-btn class="item" :loading="form.isLoading" label="保存" type="submit" color="primary"/>
                </div>
            </q-form>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.formCon
    //max-width: 800px
    margin: 30px auto 0
    padding: 20px 50px
    border-radius: 15px
    box-shadow: rgba(0, 0, 0, 0.16) 0 8px 24px 0
    background-color: #fff

.inputCon
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: start
    gap: 20px 80px
    padding: 20px 0

.input
    max-width: 400px
    // height: 80px
    // padding: 30px
    flex: 0 1 400px
    // width: 400px

.con
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: start
    gap: 20px 40px
    padding: 10px 0

.item
    flex: 0 0 100px
    width: 100px
    max-width: 100px
</style>
